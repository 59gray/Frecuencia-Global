"""Smoke test end-to-end del core n8n sin API.

Ejecuta:
- WF-001 intake
- WF-002 register-brief
- WF-003 qa
- WF-006 prepare-publish

No intenta publicar en redes.
"""

from __future__ import annotations

import argparse
import json
import os
from datetime import datetime

import requests


BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
LOG_DIR = os.path.join(BASE_DIR, 'logs')
N8N_BASE = os.environ.get('FG_N8N_BASE_URL', 'https://frecuenciaglobal.app.n8n.cloud').rstrip('/')


def post_json(path: str, payload: dict) -> requests.Response:
    url = f'{N8N_BASE}{path}'
    response = requests.post(url, json=payload, timeout=45)
    return response


def parse_json(response: requests.Response) -> dict:
    try:
        return response.json()
    except Exception:
        return {'raw_text': response.text}


def require_ok(step: str, response: requests.Response) -> dict:
    payload = parse_json(response)
    if response.status_code >= 400:
        raise RuntimeError(f'{step} fallo con {response.status_code}: {payload}')
    return payload


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description='Smoke test del core n8n')
    parser.add_argument('--piece-id', help='Pieza existente para correr WF-002/WF-003/WF-006')
    parser.add_argument('--skip-intake', action='store_true', help='No dispara WF-001')
    return parser


def print_partial(report: dict, message: str) -> None:
    report['result'] = 'partial'
    report['message'] = message
    print(json.dumps(report, ensure_ascii=False, indent=2))


def main() -> None:
    args = build_parser().parse_args()
    os.makedirs(LOG_DIR, exist_ok=True)

    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    title = f'Test n8n core {stamp}'

    intake_payload = {
        'titulo': title,
        'pilar': 'FG',
        'angulo': 'Smoke test operativo del pipeline editorial',
        'formato': 'thread',
        'plataformas': 'X, LinkedIn',
        'autor': 'Codex',
        'deadline': datetime.now().strftime('%Y-%m-%d'),
    }

    report = {
        'base_url': N8N_BASE,
        'started_at': datetime.now().isoformat(),
        'steps': [],
    }

    piece_id = args.piece_id
    if not args.skip_intake:
        intake_response = post_json('/webhook/intake', intake_payload)
        intake_json = require_ok('WF-001 intake', intake_response)
        report['steps'].append({
            'workflow': 'WF-001',
            'status_code': intake_response.status_code,
            'request': intake_payload,
            'response': intake_json,
        })
        piece_id = intake_json.get('idPieza') or piece_id

        if not piece_id:
            print_partial(
                report,
                'WF-001 respondio sin idPieza. Reintenta con --piece-id P1_NNN para validar los workflows downstream.',
            )
            return

    if not piece_id:
        raise RuntimeError('Debes pasar --piece-id si usas --skip-intake o si no quieres depender del body de WF-001.')

    register_payload = {'pieza': piece_id, 'estado': 'BRIEF_READY'}
    register_response = post_json('/webhook/register-brief', register_payload)
    register_json = require_ok('WF-002 register-brief', register_response)
    report['steps'].append({
        'workflow': 'WF-002',
        'status_code': register_response.status_code,
        'request': register_payload,
        'response': register_json,
    })

    qa_payload = {'pieza': piece_id}
    qa_response = post_json('/webhook/qa', qa_payload)
    qa_json = require_ok('WF-003 qa', qa_response)
    report['steps'].append({
        'workflow': 'WF-003',
        'status_code': qa_response.status_code,
        'request': qa_payload,
        'response': qa_json,
    })

    publish_ready_payload = {'pieza': piece_id}
    publish_ready_response = post_json('/webhook/prepare-publish', publish_ready_payload)
    publish_ready_json = require_ok('WF-006 prepare-publish', publish_ready_response)
    report['steps'].append({
        'workflow': 'WF-006',
        'status_code': publish_ready_response.status_code,
        'request': publish_ready_payload,
        'response': publish_ready_json,
    })

    x_char_count = publish_ready_json.get('xCharCount')
    if x_char_count is None or int(x_char_count) > 280:
        raise RuntimeError(f'WF-006 devolvio xCharCount invalido: {publish_ready_json}')

    report['piece_id'] = piece_id
    report['result'] = 'ok'
    report['finished_at'] = datetime.now().isoformat()

    out_path = os.path.join(LOG_DIR, f'n8n_core_smoke_test_{piece_id}.json')
    with open(out_path, 'w', encoding='utf-8') as handle:
        json.dump(report, handle, ensure_ascii=False, indent=2)

    print(json.dumps({
        'ok': True,
        'piece_id': piece_id,
        'brief_path': report['steps'][0]['response'].get('briefPath') if report['steps'] and report['steps'][0]['workflow'] == 'WF-001' else None,
        'qa_path': qa_json.get('archivo'),
        'publish_ready_path': publish_ready_json.get('archivo'),
        'xCharCount': x_char_count,
        'report_path': out_path,
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
