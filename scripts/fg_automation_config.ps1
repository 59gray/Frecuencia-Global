Set-StrictMode -Version Latest

$script:RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$script:WebsiteUrl = if ($env:FG_WEBSITE_URL) { $env:FG_WEBSITE_URL } else { "https://frecuenciaglobal.vercel.app" }
$script:WebsitePreviewUrl = if ($env:FG_WEBSITE_PREVIEW_URL) { $env:FG_WEBSITE_PREVIEW_URL } else { "https://website-three-rho-26.vercel.app" }
$script:PodcastHost = if ($env:FG_PODCAST_HOST) { $env:FG_PODCAST_HOST } else { "rss.com" }
$script:PodcastSlug = if ($env:FG_PODCAST_SLUG) { $env:FG_PODCAST_SLUG } else { "frecuencia-global-podcast" }
$script:PodcastRssUrl = if ($env:FG_PODCAST_RSS_URL) { $env:FG_PODCAST_RSS_URL } else { "https://media.rss.com/$script:PodcastSlug/feed.xml" }
$script:PodcastShowUrl = if ($env:FG_PODCAST_SHOW_URL) { $env:FG_PODCAST_SHOW_URL } else { "https://rss.com/podcasts/$script:PodcastSlug" }
$script:TiktokHandle = if ($env:FG_TIKTOK_HANDLE) { $env:FG_TIKTOK_HANDLE } else { "frecuenciaglobal" }

function Get-FgRepoRoot {
    return $script:RepoRoot
}

function Get-FgRepoPath {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Segments
    )

    $path = $script:RepoRoot
    foreach ($segment in $Segments) {
        $path = Join-Path $path $segment
    }
    return $path
}

function Get-FgWebsiteUrl {
    return $script:WebsiteUrl
}

function Get-FgWebsitePreviewUrl {
    return $script:WebsitePreviewUrl
}

function Get-FgTiktokProfileUrl {
    return "https://www.tiktok.com/@$($script:TiktokHandle)"
}

function Get-FgTiktokProfileImagePath {
    return Get-FgRepoPath "Frecuencia_Global_Assets_Base" "assets" "fg_tiktok_profile_200x200.png"
}
