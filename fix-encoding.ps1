$filesToFix = @(
    "components\marketing\contact.jsx",
    "components\marketing\cta.jsx",
    "components\marketing\features.jsx",
    "components\marketing\industries.jsx",
    "components\marketing\testimonials.jsx",
    "components\marketing\hero.jsx",
    "components\marketing\how-it-works.jsx",
    "components\marketing\footer.jsx",
    "app\page.js",
    "app\features\page.js",
    "app\get-started\page.js",
    "app\docs\page.js"
)

$utf8NoBOM = New-Object System.Text.UTF8Encoding $false

$replacements = @{}
$replacements['âš¡'] = '⚡'
$replacements['â˜ï¸'] = '☁️'
$replacements['âš½'] = '⚽'
$replacements['â˜…'] = '★'
$replacements['âœ"'] = '✓'
$replacements['â†''] = '→'
$replacements['â–¼'] = '▼'
$replacements['â€¢'] = '•'
$replacements['â€"'] = '—'
$replacements['Â©'] = '©'
$replacements['ðŸ§ '] = '🧠'
$replacements['ðŸ"''] = '🔒'
$replacements['ðŸŒ'] = '🌐'
$replacements['ðŸŽ¯'] = '🎯'
$replacements['ðŸ'¼'] = '💼'
$replacements['ðŸ'„'] = '💄'
$replacements['ðŸ"±'] = '📱'
$replacements['ðŸ"§'] = '🔧'
$replacements['ðŸ"'] = '📝'
$replacements['ðŸ"¦'] = '📦'
$replacements['ðŸ'Š'] = '💊'
$replacements['ðŸ'•'] = '👕'
$replacements['ðŸ'»'] = '💻'
$replacements['ðŸ'Ÿ'] = '👟'
$replacements['ðŸ'Ž'] = '💎'
$replacements['ðŸ·'] = '🍷'
$replacements['ðŸ°'] = '🍰'
$replacements['ðŸ'‡'] = '💇'
$replacements['ðŸš—'] = '🚗'
$replacements['ðŸ¾'] = '🐾'
$replacements['ðŸŽ'] = '🎁'
$replacements['ðŸ"š'] = '📚'
$replacements['ðŸ§¸'] = '🧸'
$replacements['ðŸš€'] = '🚀'
$replacements['ðŸ"ž'] = '📞'
$replacements['ðŸ'¬'] = '💬'
$replacements['ðŸª'] = '🏪'
$replacements['ðŸ†'] = '🏆'
$replacements['ðŸ½ï¸'] = '🍽️'
$replacements['ðŸ©â€âš•ï¸'] = '👩‍⚕️'
$replacements['ðŸ¨â€ðŸ'¼'] = '👨‍💼'
$replacements['ðŸ©â€ðŸ'¼'] = '👩‍💼'
$replacements['ðŸ¨'] = '👨'
$replacements['ðŸ©'] = '👩'
$replacements['â€™'] = [char]0x2019
$replacements['â€œ'] = [char]0x201C
$replacements['â€'] = [char]0x201D

foreach ($file in $filesToFix) {
    $fullPath = Join-Path $PSScriptRoot $file
    if (!(Test-Path $fullPath)) { Write-Host "SKIP: $file"; continue }
    
    $content = [System.IO.File]::ReadAllText($fullPath, [System.Text.Encoding]::UTF8)
    $changed = $false
    
    foreach ($key in $replacements.Keys) {
        if ($content.Contains($key)) {
            $content = $content.Replace($key, $replacements[$key])
            $changed = $true
        }
    }
    
    [System.IO.File]::WriteAllText($fullPath, $content, $utf8NoBOM)
    
    if ($changed) { Write-Host "FIXED: $file" } else { Write-Host "BOM-ONLY: $file" }
}

Write-Host "`nAll files processed!"
