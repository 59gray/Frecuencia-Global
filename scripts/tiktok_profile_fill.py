import pyautogui
import time
import os

# DATOS DEL PERFIL
DISPLAY_NAME = "Frecuencia Global"
BIO = "Analisis internacional con pulso electronico ⚡\nGeopolitica x musica electronica x datos\n↓ Web + YouTube + mas"
WEBSITE = "https://frecuenciaglobal.vercel.app"
IMAGE_PATH = r"C:/Users/farid/Documents/Frecuencia Global/Frecuencia_Global_Assets_Base/assets/fg_tiktok_profile_200x200.png"

# Espera para que el usuario coloque la ventana de edición de perfil en primer plano
time.sleep(5)

# Escribir nombre (asume que el cursor está en el campo de nombre)
pyautogui.typewrite(DISPLAY_NAME)
pyautogui.press('tab')

# Escribir bio
time.sleep(0.5)
pyautogui.typewrite(BIO)
pyautogui.press('tab')

# Escribir website
time.sleep(0.5)
pyautogui.typewrite(WEBSITE)
pyautogui.press('tab')

# Subir foto de perfil (asume que el siguiente campo es para la foto)
time.sleep(0.5)
pyautogui.typewrite(IMAGE_PATH)
pyautogui.press('enter')

# Espera y guarda (asume que el botón Save está enfocado)
time.sleep(1)
pyautogui.press('enter')

print('PERFIL TIKTOK RELLENADO')
