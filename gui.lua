-- ============================================================
-- CCRAFT SPACE Executor GUI — Lua Script
-- يعمل في Roblox Studio فقط (LocalScript داخل StarterPlayerScripts)
-- يتحرك بالماوس والتاتش (موبايل)
-- ============================================================

local Players        = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local TweenService   = game:GetService("TweenService")

local LocalPlayer  = Players.LocalPlayer
local PlayerGui    = LocalPlayer:WaitForChild("PlayerGui")

-- ============================================================
-- إنشاء الـ ScreenGui
-- ============================================================

local ScreenGui = Instance.new("ScreenGui")
ScreenGui.Name             = "CCRAFTExecutor"
ScreenGui.ResetOnSpawn     = false
ScreenGui.ZIndexBehavior   = Enum.ZIndexBehavior.Sibling
ScreenGui.Parent           = PlayerGui

-- ============================================================
-- النافذة الرئيسية
-- ============================================================

local MainFrame = Instance.new("Frame")
MainFrame.Name            = "MainFrame"
MainFrame.Size            = UDim2.new(0, 360, 0, 480)
MainFrame.Position        = UDim2.new(0.5, -180, 0.5, -240)
MainFrame.BackgroundColor3 = Color3.fromRGB(10, 12, 22)
MainFrame.BorderSizePixel = 0
MainFrame.Parent          = ScreenGui

-- زوايا دائرية
local Corner = Instance.new("UICorner")
Corner.CornerRadius = UDim.new(0, 14)
Corner.Parent       = MainFrame

-- حدود بنفسجية
local Stroke = Instance.new("UIStroke")
Stroke.Color     = Color3.fromRGB(139, 92, 246)
Stroke.Thickness = 1.5
Stroke.Transparency = 0.5
Stroke.Parent    = MainFrame

-- ظل خفيف
local Shadow = Instance.new("ImageLabel")
Shadow.Name              = "Shadow"
Shadow.Size              = UDim2.new(1, 30, 1, 30)
Shadow.Position          = UDim2.new(0, -15, 0, -10)
Shadow.BackgroundTransparency = 1
Shadow.Image             = "rbxassetid://6014261993"
Shadow.ImageColor3       = Color3.fromRGB(139, 92, 246)
Shadow.ImageTransparency = 0.7
Shadow.ScaleType         = Enum.ScaleType.Slice
Shadow.SliceCenter       = Rect.new(49, 49, 450, 450)
Shadow.ZIndex            = -1
Shadow.Parent            = MainFrame

-- ============================================================
-- Title Bar (منطقة السحب)
-- ============================================================

local TitleBar = Instance.new("Frame")
TitleBar.Name              = "TitleBar"
TitleBar.Size              = UDim2.new(1, 0, 0, 46)
TitleBar.BackgroundColor3  = Color3.fromRGB(16, 18, 32)
TitleBar.BorderSizePixel   = 0
TitleBar.Parent            = MainFrame

local TitleCorner = Instance.new("UICorner")
TitleCorner.CornerRadius = UDim.new(0, 14)
TitleCorner.Parent       = TitleBar

-- تغطية الزوايا السفلية للـ TitleBar
local TitleFill = Instance.new("Frame")
TitleFill.Size              = UDim2.new(1, 0, 0, 10)
TitleFill.Position          = UDim2.new(0, 0, 1, -10)
TitleFill.BackgroundColor3  = Color3.fromRGB(16, 18, 32)
TitleFill.BorderSizePixel   = 0
TitleFill.Parent            = TitleBar

-- أيقونة البرنامج
local TitleIcon = Instance.new("TextLabel")
TitleIcon.Size              = UDim2.new(0, 30, 0, 30)
TitleIcon.Position          = UDim2.new(0, 10, 0.5, -15)
TitleIcon.BackgroundColor3  = Color3.fromRGB(139, 92, 246)
TitleIcon.Text              = "⚡"
TitleIcon.TextScaled        = true
TitleIcon.Font              = Enum.Font.GothamBold
TitleIcon.TextColor3        = Color3.new(1,1,1)
TitleIcon.BorderSizePixel   = 0
TitleIcon.Parent            = TitleBar

local IconCorner = Instance.new("UICorner")
IconCorner.CornerRadius = UDim.new(0, 8)
IconCorner.Parent       = TitleIcon

-- اسم البرنامج
local TitleText = Instance.new("TextLabel")
TitleText.Size              = UDim2.new(0, 180, 1, 0)
TitleText.Position          = UDim2.new(0, 48, 0, 0)
TitleText.BackgroundTransparency = 1
TitleText.Text              = "CCRAFT Executor"
TitleText.TextColor3        = Color3.new(1, 1, 1)
TitleText.Font              = Enum.Font.GothamBold
TitleText.TextSize          = 14
TitleText.TextXAlignment    = Enum.TextXAlignment.Left
TitleText.Parent            = TitleBar

-- زر الإغلاق
local CloseBtn = Instance.new("TextButton")
CloseBtn.Size               = UDim2.new(0, 28, 0, 28)
CloseBtn.Position           = UDim2.new(1, -36, 0.5, -14)
CloseBtn.BackgroundColor3   = Color3.fromRGB(248, 113, 113)
CloseBtn.Text               = "✕"
CloseBtn.TextColor3         = Color3.new(1,1,1)
CloseBtn.Font               = Enum.Font.GothamBold
CloseBtn.TextSize           = 13
CloseBtn.BorderSizePixel    = 0
CloseBtn.AutoButtonColor    = false
CloseBtn.Parent             = TitleBar

local CloseCorner = Instance.new("UICorner")
CloseCorner.CornerRadius = UDim.new(0, 8)
CloseCorner.Parent       = CloseBtn

-- زر التصغير
local MinBtn = Instance.new("TextButton")
MinBtn.Size               = UDim2.new(0, 28, 0, 28)
MinBtn.Position           = UDim2.new(1, -68, 0.5, -14)
MinBtn.BackgroundColor3   = Color3.fromRGB(251, 191, 36)
MinBtn.Text               = "—"
MinBtn.TextColor3         = Color3.fromRGB(80, 60, 0)
MinBtn.Font               = Enum.Font.GothamBold
MinBtn.TextSize           = 14
MinBtn.BorderSizePixel    = 0
MinBtn.AutoButtonColor    = false
MinBtn.Parent             = TitleBar

local MinCorner = Instance.new("UICorner")
MinCorner.CornerRadius = UDim.new(0, 8)
MinCorner.Parent       = MinBtn

-- ============================================================
-- محرر الكود (ScrollingFrame + TextBox)
-- ============================================================

local EditorBG = Instance.new("Frame")
EditorBG.Name             = "EditorBG"
EditorBG.Size             = UDim2.new(1, -16, 0, 240)
EditorBG.Position         = UDim2.new(0, 8, 0, 54)
EditorBG.BackgroundColor3 = Color3.fromRGB(6, 8, 16)
EditorBG.BorderSizePixel  = 0
EditorBG.Parent           = MainFrame

local EditorCorner = Instance.new("UICorner")
EditorCorner.CornerRadius = UDim.new(0, 10)
EditorCorner.Parent       = EditorBG

local EditorStroke = Instance.new("UIStroke")
EditorStroke.Color       = Color3.fromRGB(139, 92, 246)
EditorStroke.Thickness   = 1
EditorStroke.Transparency = 0.7
EditorStroke.Parent      = EditorBG

-- أرقام الأسطر
local LineNums = Instance.new("TextLabel")
LineNums.Name             = "LineNums"
LineNums.Size             = UDim2.new(0, 28, 1, -8)
LineNums.Position         = UDim2.new(0, 4, 0, 4)
LineNums.BackgroundTransparency = 1
LineNums.Text             = "1"
LineNums.TextColor3       = Color3.fromRGB(100, 116, 139)
LineNums.Font             = Enum.Font.Code
LineNums.TextSize         = 12
LineNums.TextXAlignment   = Enum.TextXAlignment.Right
LineNums.TextYAlignment   = Enum.TextYAlignment.Top
LineNums.Parent           = EditorBG

-- محرر الكود
local CodeBox = Instance.new("TextBox")
CodeBox.Name              = "CodeBox"
CodeBox.Size              = UDim2.new(1, -40, 1, -8)
CodeBox.Position          = UDim2.new(0, 36, 0, 4)
CodeBox.BackgroundTransparency = 1
CodeBox.Text              = "-- اكتب سكربت Lua هنا\nprint(\"Hello from CCRAFT!\")"
CodeBox.TextColor3        = Color3.fromRGB(226, 232, 240)
CodeBox.PlaceholderText   = "-- اكتب السكربت هنا..."
CodeBox.PlaceholderColor3 = Color3.fromRGB(100, 116, 139)
CodeBox.Font              = Enum.Font.Code
CodeBox.TextSize          = 12
CodeBox.TextXAlignment    = Enum.TextXAlignment.Left
CodeBox.TextYAlignment    = Enum.TextYAlignment.Top
CodeBox.MultiLine         = true
CodeBox.ClearTextOnFocus  = false
CodeBox.BorderSizePixel   = 0
CodeBox.Parent            = EditorBG

-- تحديث أرقام الأسطر
CodeBox:GetPropertyChangedSignal("Text"):Connect(function()
    local lines = {}
    local count = 1
    for _ in CodeBox.Text:gmatch("\n") do count += 1 end
    for i = 1, count do table.insert(lines, tostring(i)) end
    LineNums.Text = table.concat(lines, "\n")
end)

-- ============================================================
-- أزرار الإجراءات
-- ============================================================

local function makeBtn(text, bg, pos, size)
    local btn = Instance.new("TextButton")
    btn.Size              = size or UDim2.new(0, 100, 0, 34)
    btn.Position          = pos
    btn.BackgroundColor3  = bg
    btn.Text              = text
    btn.TextColor3        = Color3.new(1, 1, 1)
    btn.Font              = Enum.Font.GothamBold
    btn.TextSize          = 13
    btn.BorderSizePixel   = 0
    btn.AutoButtonColor   = false
    btn.Parent            = MainFrame

    local c = Instance.new("UICorner")
    c.CornerRadius = UDim.new(0, 10)
    c.Parent = btn

    -- hover effect
    btn.MouseEnter:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.15), {
            BackgroundColor3 = btn.BackgroundColor3:Lerp(Color3.new(1,1,1), 0.12)
        }):Play()
    end)
    btn.MouseLeave:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.15), {
            BackgroundColor3 = bg
        }):Play()
    end)
    btn.MouseButton1Down:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.08), {
            Size = (size or UDim2.new(0,100,0,34)) - UDim2.new(0,2,0,2)
        }):Play()
    end)
    btn.MouseButton1Up:Connect(function()
        TweenService:Create(btn, TweenInfo.new(0.08), {
            Size = size or UDim2.new(0,100,0,34)
        }):Play()
    end)

    return btn
end

-- زر تنفيذ
local RunBtn = makeBtn(
    "▶ تنفيذ",
    Color3.fromRGB(139, 92, 246),
    UDim2.new(0, 8, 0, 304),
    UDim2.new(0, 106, 0, 34)
)

-- زر مسح
local ClearBtn = makeBtn(
    "🗑 مسح",
    Color3.fromRGB(239, 68, 68),
    UDim2.new(0, 120, 0, 304),
    UDim2.new(0, 80, 0, 34)
)

-- زر نسخ
local CopyBtn = makeBtn(
    "📋 نسخ",
    Color3.fromRGB(15, 168, 198),
    UDim2.new(0, 206, 0, 304),
    UDim2.new(0, 80, 0, 34)
)

-- زر حفظ
local SaveBtn = makeBtn(
    "💾 حفظ",
    Color3.fromRGB(251, 191, 36),
    UDim2.new(0, 292, 0, 304),
    UDim2.new(0, 60, 0, 34)
)
SaveBtn.TextColor3 = Color3.fromRGB(80, 60, 0)

-- ============================================================
-- Console Output
-- ============================================================

local ConsoleBG = Instance.new("Frame")
ConsoleBG.Name            = "ConsoleBG"
ConsoleBG.Size            = UDim2.new(1, -16, 0, 110)
ConsoleBG.Position        = UDim2.new(0, 8, 0, 348)
ConsoleBG.BackgroundColor3 = Color3.fromRGB(6, 8, 16)
ConsoleBG.BorderSizePixel = 0
ConsoleBG.Parent          = MainFrame

local ConsoleCorner = Instance.new("UICorner")
ConsoleCorner.CornerRadius = UDim.new(0, 10)
ConsoleCorner.Parent      = ConsoleBG

local ConsoleStroke = Instance.new("UIStroke")
ConsoleStroke.Color       = Color3.fromRGB(139, 92, 246)
ConsoleStroke.Thickness   = 1
ConsoleStroke.Transparency = 0.7
ConsoleStroke.Parent      = ConsoleBG

-- عنوان Console
local ConsoleTitle = Instance.new("TextLabel")
ConsoleTitle.Size             = UDim2.new(1, -10, 0, 20)
ConsoleTitle.Position         = UDim2.new(0, 8, 0, 4)
ConsoleTitle.BackgroundTransparency = 1
ConsoleTitle.Text             = "⬛ Output Console"
ConsoleTitle.TextColor3       = Color3.fromRGB(139, 92, 246)
ConsoleTitle.Font             = Enum.Font.GothamBold
ConsoleTitle.TextSize         = 11
ConsoleTitle.TextXAlignment   = Enum.TextXAlignment.Left
ConsoleTitle.Parent           = ConsoleBG

-- نص الـ Console
local ConsoleText = Instance.new("TextLabel")
ConsoleText.Name              = "ConsoleText"
ConsoleText.Size              = UDim2.new(1, -10, 0, 82)
ConsoleText.Position          = UDim2.new(0, 8, 0, 24)
ConsoleText.BackgroundTransparency = 1
ConsoleText.Text              = "> CCRAFT Executor جاهز"
ConsoleText.TextColor3        = Color3.fromRGB(74, 222, 128)
ConsoleText.Font              = Enum.Font.Code
ConsoleText.TextSize          = 11
ConsoleText.TextXAlignment    = Enum.TextXAlignment.Left
ConsoleText.TextYAlignment    = Enum.TextYAlignment.Top
ConsoleText.TextWrapped       = true
ConsoleText.Parent            = ConsoleBG

local consoleLines = {"> CCRAFT Executor جاهز"}

local function log(msg, color)
    table.insert(consoleLines, msg)
    if #consoleLines > 6 then table.remove(consoleLines, 1) end
    ConsoleText.Text = table.concat(consoleLines, "\n")
    ConsoleText.TextColor3 = color or Color3.fromRGB(226, 232, 240)
end

-- ============================================================
-- منطق الأزرار
-- ============================================================

-- تنفيذ
RunBtn.MouseButton1Click:Connect(function()
    local code = CodeBox.Text
    if code == "" or code == "-- اكتب سكربت Lua هنا\nprint(\"Hello from CCRAFT!\")" then
        log("> ⚠️ لا يوجد كود للتنفيذ", Color3.fromRGB(251, 191, 36))
        return
    end

    log("> ▶ جارٍ التنفيذ...", Color3.fromRGB(139, 92, 246))

    local ok, err = pcall(function()
        local fn = loadstring(code)
        if fn then
            fn()
        else
            error("فشل تحليل الكود")
        end
    end)

    if ok then
        log("> ✅ تم التنفيذ بنجاح", Color3.fromRGB(74, 222, 128))
    else
        log("> ❌ خطأ: " .. tostring(err), Color3.fromRGB(248, 113, 113))
    end
end)

-- مسح
ClearBtn.MouseButton1Click:Connect(function()
    CodeBox.Text = ""
    LineNums.Text = "1"
    log("> 🗑 تم مسح المحرر", Color3.fromRGB(248, 113, 113))
end)

-- نسخ (في Studio بنضع في Clipboard)
CopyBtn.MouseButton1Click:Connect(function()
    if CodeBox.Text == "" then
        log("> ⚠️ لا يوجد كود للنسخ", Color3.fromRGB(251, 191, 36))
        return
    end
    -- Roblox ما عنده clipboard API مباشرة، نعرض رسالة
    log("> 📋 حدد الكود يدوياً للنسخ", Color3.fromRGB(0, 242, 254))
    CodeBox:CaptureFocus()
end)

-- حفظ (نسخ للـ output)
SaveBtn.MouseButton1Click:Connect(function()
    log("> 💾 احفظ الكود من المحرر يدوياً", Color3.fromRGB(251, 191, 36))
end)

-- إغلاق
CloseBtn.MouseButton1Click:Connect(function()
    TweenService:Create(MainFrame, TweenInfo.new(0.3, Enum.EasingStyle.Back, Enum.EasingDirection.In), {
        Size     = UDim2.new(0, 0, 0, 0),
        Position = UDim2.new(0.5, 0, 0.5, 0)
    }):Play()
    task.delay(0.35, function() ScreenGui:Destroy() end)
end)

-- تصغير
local minimized = false
MinBtn.MouseButton1Click:Connect(function()
    minimized = not minimized
    if minimized then
        TweenService:Create(MainFrame, TweenInfo.new(0.25, Enum.EasingStyle.Quad), {
            Size = UDim2.new(0, 360, 0, 46)
        }):Play()
        MinBtn.Text = "▲"
    else
        TweenService:Create(MainFrame, TweenInfo.new(0.25, Enum.EasingStyle.Quad), {
            Size = UDim2.new(0, 360, 0, 480)
        }):Play()
        MinBtn.Text = "—"
    end
end)

-- ============================================================
-- السحب بالماوس والتاتش (موبايل)
-- ============================================================

local dragging   = false
local dragOffset = Vector2.new()

-- ماوس
TitleBar.InputBegan:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1 then
        dragging   = true
        dragOffset = Vector2.new(
            input.Position.X - MainFrame.AbsolutePosition.X,
            input.Position.Y - MainFrame.AbsolutePosition.Y
        )
    end
end)

-- تاتش (موبايل)
TitleBar.TouchStarted:Connect(function(touch)
    dragging   = true
    dragOffset = Vector2.new(
        touch.Position.X - MainFrame.AbsolutePosition.X,
        touch.Position.Y - MainFrame.AbsolutePosition.Y
    )
end)

-- حركة الماوس
UserInputService.InputChanged:Connect(function(input)
    if not dragging then return end

    local pos
    if input.UserInputType == Enum.UserInputType.MouseMovement then
        pos = input.Position
    elseif input.UserInputType == Enum.UserInputType.Touch then
        pos = input.Position
    else
        return
    end

    local screenSize = ScreenGui.AbsoluteSize
    local frameSize  = MainFrame.AbsoluteSize

    -- احسب الموقع الجديد
    local newX = math.clamp(pos.X - dragOffset.X, 0, screenSize.X - frameSize.X)
    local newY = math.clamp(pos.Y - dragOffset.Y, 0, screenSize.Y - frameSize.Y)

    MainFrame.Position = UDim2.new(0, newX, 0, newY)
end)

-- إيقاف السحب
UserInputService.InputEnded:Connect(function(input)
    if input.UserInputType == Enum.UserInputType.MouseButton1
    or input.UserInputType == Enum.UserInputType.Touch then
        dragging = false
    end
end)

-- ============================================================
-- Animation ظهور عند الفتح
-- ============================================================

MainFrame.Size     = UDim2.new(0, 0, 0, 0)
MainFrame.Position = UDim2.new(0.5, 0, 0.5, 0)

TweenService:Create(MainFrame, TweenInfo.new(0.4, Enum.EasingStyle.Back, Enum.EasingDirection.Out), {
    Size     = UDim2.new(0, 360, 0, 480),
    Position = UDim2.new(0.5, -180, 0.5, -240)
}):Play()

log("> ✅ CCRAFT Executor v2.4 جاهز", Color3.fromRGB(74, 222, 128))
