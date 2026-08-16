[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$Destination = "C:\Users\carli\.agents\skills\chronos-lesson-production"
)

$scriptDirectory = Split-Path -Parent $PSCommandPath
$repositoryRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$source = Join-Path $repositoryRoot ".agents\skills\chronos-lesson-production"

if (-not (Test-Path -LiteralPath $source -PathType Container)) {
    throw "Canonical skill not found: $source"
}

$resolvedParent = Resolve-Path -LiteralPath (Split-Path -Parent $Destination) -ErrorAction Stop
$resolvedDestination = Join-Path $resolvedParent (Split-Path -Leaf $Destination)

if ($resolvedDestination -eq $source -or $resolvedDestination -eq $repositoryRoot) {
    throw "Destination must be a personal skill directory outside the repository."
}

if (-not $PSCmdlet.ShouldProcess($resolvedDestination, "Replace with the canonical Chronos lesson production skill")) {
    return
}

$staging = Join-Path $resolvedParent ".chronos-lesson-production-sync-$([Guid]::NewGuid().ToString('N'))"

try {
    Copy-Item -LiteralPath $source -Destination $staging -Recurse -Force

    if (Test-Path -LiteralPath $resolvedDestination) {
        Remove-Item -LiteralPath $resolvedDestination -Recurse -Force
    }

    Move-Item -LiteralPath $staging -Destination $resolvedDestination
}
finally {
    if (Test-Path -LiteralPath $staging) {
        Remove-Item -LiteralPath $staging -Recurse -Force
    }
}

Write-Output "Synced $source -> $resolvedDestination"
