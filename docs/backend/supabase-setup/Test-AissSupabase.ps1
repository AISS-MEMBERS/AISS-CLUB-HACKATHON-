# Read-only anonymous Data API smoke test. Run from your project root.
& {
    $ErrorActionPreference = "Stop"
    $EnvFile = Join-Path (Get-Location).Path ".env.local"
    if (-not (Test-Path -LiteralPath $EnvFile)) {
        throw ".env.local not found in the current project folder."
    }
    $Config = @{}
    foreach ($Line in [System.IO.File]::ReadAllLines($EnvFile)) {
        if ($Line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $Config[$Matches[1]] = $Matches[2].Trim().Trim('"').Trim("'")
        }
    }
    $BaseUrl = [string]$Config["NEXT_PUBLIC_SUPABASE_URL"]
    $PublicKey = [string]$Config["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    if ($BaseUrl -notmatch '^https://[a-z0-9-]+\.supabase\.co/?$' -or
        -not $PublicKey.StartsWith("sb_publishable_") -or
        $PublicKey.Contains("REPLACE")) {
        throw "Set the real URL and publishable key in .env.local first."
    }
    $Headers = @{ apikey = $PublicKey }
    $BaseUrl = $BaseUrl.TrimEnd("/")
    $Rows = Invoke-RestMethod -Method Get -Headers $Headers -TimeoutSec 20 -Uri ($BaseUrl + "/rest/v1/events?select=id,publication_status&limit=50")
    if (@($Rows | Where-Object publication_status -ne "published").Count -gt 0) {
        throw "FAIL: Unpublished event visible anonymously."
    }
    Write-Host "PUBLIC_EVENTS_VISIBLE=$($Rows.Count)"
    $Published = Invoke-RestMethod -Method Get -Headers $Headers -TimeoutSec 20 -Uri ($BaseUrl + "/rest/v1/events?select=id&id=eq.10000000-0000-4000-8000-000000000001")
    if (@($Published).Count -ne 1) { throw "Published fixture missing. Run 03-demo-fixtures.sql first." }
    $Draft = Invoke-RestMethod -Method Get -Headers $Headers -TimeoutSec 20 -Uri ($BaseUrl + "/rest/v1/events?select=id&id=eq.10000000-0000-4000-8000-000000000002")
    if (@($Draft).Count -ne 0) { throw "FAIL: Draft fixture leaked." }

    $Denied = $false
    try {
        $null = Invoke-RestMethod -Method Get -Headers $Headers -TimeoutSec 20 -Uri ($BaseUrl + "/rest/v1/contact_messages?select=id&limit=1")
    } catch {
        $Response = $_.Exception.Response
        if ($null -eq $Response) { throw }
        $Code = [int]$Response.StatusCode
        if ($Code -in @(401,403)) { $Denied = $true } else { throw }
    }
    if (-not $Denied) { throw "FAIL: Anonymous message access was not denied." }
    Write-Host "ANONYMOUS_DRAFT_HIDDEN=PASS" -ForegroundColor Green
    Write-Host "ANONYMOUS_MESSAGES_DENIED=PASS" -ForegroundColor Green
    Write-Host "READ ONLY / NO DATABASE WRITES / NO COMMIT / NO PUSH"
}
