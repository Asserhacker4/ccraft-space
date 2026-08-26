--[[
╔══════════════════════════════════════════════════════════════╗
║            CCRAFT SPACE — Roblox GUI Library v3.0            ║
║            Open Source — MIT License                         ║
║            https://ccraftspace.github.io                     ║
╠══════════════════════════════════════════════════════════════╣
║  الاستخدام الأساسي:                                          ║
║    local CC = loadstring(game:HttpGet("رابط_المكتبة"))()     ║
║    CC.Open()   / CC.Close()   / CC.Toggle()                  ║
║    CC.Notify("عنوان","رسالة",3,"success")                   ║
║                                                              ║
║  إضافة زر من مكتبتك الخاصة:                                 ║
║    CC.AddButton({                                            ║
║      icon="⚡", label="اسم", desc="وصف",                    ║
║      color=CC.Colors.GREEN,                                  ║
║      action=function() print("يعمل!") end                   ║
║    })                                                        ║
╚══════════════════════════════════════════════════════════════╝
]]

local CC = {}
CC.Version  = "3.0"
CC.Name     = "CCRAFT SPACE"
CC.Website  = "https://ccraftspace.github.io"
CC.Firebase = "https://ccraft-space-scripts-default-rtdb.firebaseio.com"
CC._buttons = {}
CC._open    = false
CC._gui     = nil

local Players          = game:GetService("Players")
local TweenService     = game:GetService("TweenService")
local UserInputService = game:GetService("UserInputService")
local HttpService      = game:GetService("HttpService")
local CoreGui          = game:GetService("CoreGui")
local LP               = Players.LocalPlayer

CC.Colors = {
    VIOLET = Color3.fromRGB(139,92,246),
    CYAN   = Color3.fromRGB(0,242,254),
    PINK   = Color3.fromRGB(244,114,182),
    GOLD   = Color3.fromRGB(251,191,36),
    GREEN  = Color3.fromRGB(74,222,128),
    RED    = Color3.fromRGB(248,113,113),
    ORANGE = Color3.fromRGB(251,146,60),
    BLUE   = Color3.fromRGB(96,165,250),
    WHITE  = Color3.fromRGB(240,240,255),
}

local T = {
    BG=Color3.fromRGB(7,8,15), CARD=Color3.fromRGB(12,14,26),
    ELEM=Color3.fromRGB(17,20,36), BORDER=Color3.fromRGB(28,30,50),
    HI=Color3.fromRGB(240,240,255), MID=Color3.fromRGB(110,110,150),
    LO=Color3.fromRGB(55,55,80),
    V=Color3.fromRGB(139,92,246), C=Color3.fromRGB(0,242,254),
    G=Color3.fromRGB(74,222,128), R=Color3.fromRGB(248,113,113),
    GO=Color3.fromRGB(251,191,36),
}

-- helpers
local function New(c,p,par)
    local o=Instance.new(c)
    for k,v in pairs(p) do pcall(function() o[k]=v end) end
    if par then o.Parent=par end
    return o
end
local function Corner(o,r) return New("UICorner",{CornerRadius=UDim.new(0,r or 10)},o) end
local function Stroke(o,c,th,tr) return New("UIStroke",{Color=c or T.BORDER,Thickness=th or 1,Transparency=tr or 0.4,ApplyStrokeMode=Enum.ApplyStrokeMode.Border},o) end
local function Tw(o,p,t,s,d) TweenService:Create(o,TweenInfo.new(t or 0.2,s or Enum.EasingStyle.Quart,d or Enum.EasingDirection.Out),p):Play() end
local function Pad(o,t,b,l,r) return New("UIPadding",{PaddingTop=UDim.new(0,t or 0),PaddingBottom=UDim.new(0,b or 0),PaddingLeft=UDim.new(0,l or 0),PaddingRight=UDim.new(0,r or 0)},o) end
local function List(o,fd,p,ha) return New("UIListLayout",{FillDirection=fd or Enum.FillDirection.Vertical,Padding=UDim.new(0,p or 6),HorizontalAlignment=ha or Enum.HorizontalAlignment.Center,SortOrder=Enum.SortOrder.LayoutOrder},o) end
local function Grad(o,c1,c2,r) return New("UIGradient",{Color=ColorSequence.new{ColorSequenceKeypoint.new(0,c1),ColorSequenceKeypoint.new(1,c2)},Rotation=r or 135},o) end

-- Draggable (mouse + touch)
local function MakeDraggable(win,handle)
    handle=handle or win
    local drag,ds,sp=false,nil,nil
    handle.InputBegan:Connect(function(i)
        if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then
            drag=true; ds=i.Position; sp=win.Position
        end
    end)
    UserInputService.InputChanged:Connect(function(i)
        if drag and (i.UserInputType==Enum.UserInputType.MouseMovement or i.UserInputType==Enum.UserInputType.Touch) then
            local d=i.Position-ds
            win.Position=UDim2.new(sp.X.Scale,sp.X.Offset+d.X,sp.Y.Scale,sp.Y.Offset+d.Y)
        end
    end)
    UserInputService.InputEnded:Connect(function(i)
        if i.UserInputType==Enum.UserInputType.MouseButton1 or i.UserInputType==Enum.UserInputType.Touch then drag=false end
    end)
end

-- Notifications
local function getNG()
    local g=CoreGui:FindFirstChild("CC_N")
    if g then return g end
    g=New("ScreenGui",{Name="CC_N",ResetOnSpawn=false,ZIndexBehavior=Enum.ZIndexBehavior.Sibling,IgnoreGuiInset=true},CoreGui)
    New("UIListLayout",{Padding=UDim.new(0,8),HorizontalAlignment=Enum.HorizontalAlignment.Right,VerticalAlignment=Enum.VerticalAlignment.Bottom,SortOrder=Enum.SortOrder.LayoutOrder,FillDirection=Enum.FillDirection.Vertical},g)
    Pad(g,0,20,0,16)
    return g
end

function CC.Notify(title,msg,dur,kind)
    dur=dur or 3
    local col=({success=T.G,error=T.R,warn=T.GO,info=T.C})[kind] or T.V
    local g=getNG()
    local card=New("Frame",{Size=UDim2.new(0,300,0,64),BackgroundColor3=T.CARD,BackgroundTransparency=0.05,Position=UDim2.new(1,320,0,0),ClipsDescendants=true},g)
    Corner(card,14)
    local ab=New("Frame",{Size=UDim2.new(0,3,1,-16),Position=UDim2.new(0,0,0,8),BackgroundColor3=col,BorderSizePixel=0},card); Corner(ab,3)
    New("Frame",{Size=UDim2.new(1,0,1,0),BackgroundColor3=col,BackgroundTransparency=0.92,BorderSizePixel=0},card)
    New("TextLabel",{Text=title,Size=UDim2.new(1,-16,0,20),Position=UDim2.new(0,14,0,10),Font=Enum.Font.GothamBold,TextSize=13,TextColor3=col,TextXAlignment=Enum.TextXAlignment.Left,BackgroundTransparency=1,ZIndex=2},card)
    New("TextLabel",{Text=msg,Size=UDim2.new(1,-16,0,18),Position=UDim2.new(0,14,0,32),Font=Enum.Font.Gotham,TextSize=11,TextColor3=T.MID,TextXAlignment=Enum.TextXAlignment.Left,TextTruncate=Enum.TextTruncate.AtEnd,BackgroundTransparency=1,ZIndex=2},card)
    local bar=New("Frame",{Size=UDim2.new(1,0,0,2),Position=UDim2.new(0,0,1,-2),BackgroundColor3=col,BackgroundTransparency=0.3,BorderSizePixel=0,ZIndex=3},card)
    Tw(card,{Position=UDim2.new(0,0,0,0)},0.4,Enum.EasingStyle.Back)
    Tw(bar,{Size=UDim2.new(0,0,0,2)},dur,Enum.EasingStyle.Linear)
    task.delay(dur,function() Tw(card,{Position=UDim2.new(1,320,0,0),BackgroundTransparency=1},0.3); task.wait(0.35); card:Destroy() end)
end

-- Fetch scripts
local function FetchScripts()
    local ok,res=pcall(function() return HttpService:GetAsync(CC.Firebase.."/scripts.json") end)
    if not ok then warn("[CC] HTTP fail: "..tostring(res)); return {} end
    local ok2,data=pcall(HttpService.JSONDecode,HttpService,res)
    if not ok2 or type(data)~="table" then return {} end
    local list={}
    for id,s in pairs(data) do
        if type(s)=="table" and s.title and s.code then
            table.insert(list,{id=id,title=tostring(s.title or ""),code=tostring(s.code or ""),
                category=tostring(s.category or ""),author=tostring(s.author or "مجهول"),
                likes=tonumber(s.likes) or 0,description=tostring(s.description or ""),
                map=tostring(s.map or ""),timestamp=tonumber(s.timestamp) or 0})
        end
    end
    table.sort(list,function(a,b) return a.timestamp>b.timestamp end)
    return list
end

-- Make custom button card
function CC._makeCBtn(parent,b,idx)
    local card=New("Frame",{Size=UDim2.new(1,0,0,60),BackgroundColor3=T.CARD,BackgroundTransparency=0.4,ZIndex=7,LayoutOrder=idx},parent)
    Corner(card,12); Stroke(card,b.color,1.5,0.65)
    New("Frame",{Size=UDim2.new(1,0,1,0),BackgroundColor3=b.color,BackgroundTransparency=0.93,BorderSizePixel=0,ZIndex=7},card)
    local ab=New("Frame",{Size=UDim2.new(0,3,1,-16),Position=UDim2.new(0,0,0,8),BackgroundColor3=b.color,BorderSizePixel=0,ZIndex=8},card); Corner(ab,3)
    New("TextLabel",{Text=b.icon.."  "..b.label,Size=UDim2.new(1,-90,0,22),Position=UDim2.new(0,12,0,8),Font=Enum.Font.GothamBold,TextSize=13,TextColor3=b.color,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},card)
    if b.desc~="" then New("TextLabel",{Text=b.desc,Size=UDim2.new(1,-90,0,16),Position=UDim2.new(0,12,0,32),Font=Enum.Font.Gotham,TextSize=10,TextColor3=T.LO,BackgroundTransparency=1,TextTruncate=Enum.TextTruncate.AtEnd,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},card) end
    local rb=New("TextButton",{Text="▶ تشغيل",Size=UDim2.new(0,72,0,28),Position=UDim2.new(1,-82,0.5,-14),Font=Enum.Font.GothamBold,TextSize=11,TextColor3=T.HI,BackgroundColor3=b.color,BackgroundTransparency=0.2,ZIndex=9},card)
    Corner(rb,8)
    card.MouseEnter:Connect(function() Tw(card,{BackgroundTransparency=0.2},0.15) end)
    card.MouseLeave:Connect(function() Tw(card,{BackgroundTransparency=0.4},0.15) end)
    rb.MouseButton1Click:Connect(function()
        Tw(rb,{BackgroundTransparency=0},0.08); task.wait(0.1); Tw(rb,{BackgroundTransparency=0.2},0.15)
        local ok,err=pcall(b.action)
        if ok then CC.Notify("✅ "..b.label,"تم التشغيل",2,"success")
        else CC.Notify("❌ خطأ",tostring(err):sub(1,60),3,"error") end
    end)
end

function CC._refresh()
    if CC._cSection then
        CC._cSection:ClearAllChildren(); List(CC._cSection,Enum.FillDirection.Vertical,6)
        if #CC._buttons>0 then
            New("TextLabel",{Text="🔌 إضافات ("..#CC._buttons..")",Size=UDim2.new(1,0,0,20),Font=Enum.Font.GothamBold,TextSize=11,TextColor3=T.LO,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Right,ZIndex=7},CC._cSection)
            for i,b in ipairs(CC._buttons) do CC._makeCBtn(CC._cSection,b,i) end
        end
    end
    if CC._cPageList then
        CC._cPageList:ClearAllChildren(); List(CC._cPageList,Enum.FillDirection.Vertical,7)
        if #CC._buttons==0 then
            New("TextLabel",{Text="لا توجد إضافات بعد\nاستخدم CC.AddButton() من مكتبتك الخاصة",Size=UDim2.new(1,0,0,44),Font=Enum.Font.Gotham,TextSize=11,TextColor3=T.LO,BackgroundTransparency=1,TextWrapped=true,TextXAlignment=Enum.TextXAlignment.Right,ZIndex=7},CC._cPageList)
        else
            for i,b in ipairs(CC._buttons) do CC._makeCBtn(CC._cPageList,b,i) end
        end
    end
end

function CC.AddButton(opts)
    assert(type(opts)=="table","AddButton: يجب table")
    assert(type(opts.label)=="string" and opts.label~="","AddButton: label مطلوب")
    assert(type(opts.action)=="function","AddButton: action مطلوب")
    local b={icon=opts.icon or "🔘",label=opts.label,desc=opts.desc or "",color=opts.color or T.V,action=opts.action}
    table.insert(CC._buttons,b)
    CC._refresh()
    return b
end

function CC.Open()
    if CC._gui then CC._gui:Destroy() end
    local SG=New("ScreenGui",{Name="CCRAFTSpace",ResetOnSpawn=false,ZIndexBehavior=Enum.ZIndexBehavior.Sibling,IgnoreGuiInset=true},CoreGui)
    CC._gui=SG; CC._open=true

    local W=New("Frame",{Name="Win",Size=UDim2.new(0,540,0,560),Position=UDim2.new(0.5,-270,0.5,-280),BackgroundColor3=T.BG,BackgroundTransparency=0,ClipsDescendants=true,ZIndex=2},SG)
    Corner(W,18); Stroke(W,T.V,1.5,0.6)

    -- bg gradient
    local bg2=New("Frame",{Size=UDim2.new(1,0,0,200),BackgroundColor3=T.V,BackgroundTransparency=0.93,ZIndex=3,BorderSizePixel=0},W)
    Grad(bg2,Color3.fromRGB(22,10,55),T.BG,180)

    -- TITLEBAR
    local TB=New("Frame",{Size=UDim2.new(1,0,0,48),BackgroundColor3=T.CARD,BackgroundTransparency=0.2,ZIndex=10},W)
    New("Frame",{Size=UDim2.new(1,0,0,12),Position=UDim2.new(0,0,1,-12),BackgroundColor3=T.CARD,BackgroundTransparency=0.2,BorderSizePixel=0,ZIndex=10},TB)

    -- dot
    local dot=New("Frame",{Size=UDim2.new(0,8,0,8),Position=UDim2.new(0,14,0.5,-4),BackgroundColor3=T.V,BorderSizePixel=0,ZIndex=12},TB); Corner(dot,4)
    Grad(dot,T.V,T.C,90)

    local tl=New("TextLabel",{Text="CCRAFT SPACE",Size=UDim2.new(0,200,0,28),Position=UDim2.new(0,28,0,4),Font=Enum.Font.GothamBold,TextSize=15,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=12},TB)
    Grad(tl,T.V,T.C,90)
    New("TextLabel",{Text="منصة سكربتات Roblox  •  v"..CC.Version,Size=UDim2.new(0,240,0,14),Position=UDim2.new(0,28,0,28),Font=Enum.Font.Gotham,TextSize=9,TextColor3=T.LO,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=12},TB)

    local function CB(icon,pos,bg)
        local b=New("TextButton",{Text=icon,Size=UDim2.new(0,28,0,28),Position=pos,Font=Enum.Font.GothamBold,TextSize=12,TextColor3=T.MID,BackgroundColor3=bg,BackgroundTransparency=0.75,ZIndex=13},TB)
        Corner(b,8)
        b.MouseEnter:Connect(function() Tw(b,{BackgroundTransparency=0.3,TextColor3=T.HI},0.15) end)
        b.MouseLeave:Connect(function() Tw(b,{BackgroundTransparency=0.75,TextColor3=T.MID},0.15) end)
        return b
    end
    local BClose=CB("✕",UDim2.new(1,-38,0.5,-14),T.R)
    local BMin=CB("—",UDim2.new(1,-72,0.5,-14),T.GO)

    -- SIDEBAR
    local SB=New("Frame",{Size=UDim2.new(0,110,1,-48),Position=UDim2.new(0,0,0,48),BackgroundColor3=T.CARD,BackgroundTransparency=0.45,ZIndex=5},W)
    New("Frame",{Size=UDim2.new(0,1,1,0),Position=UDim2.new(1,-1,0,0),BackgroundColor3=T.BORDER,BorderSizePixel=0,ZIndex=6},SB)
    List(SB,Enum.FillDirection.Vertical,4,Enum.HorizontalAlignment.Center); Pad(SB,10,8,6,6)

    -- CONTENT
    local CA=New("Frame",{Size=UDim2.new(1,-110,1,-48),Position=UDim2.new(0,110,0,48),BackgroundTransparency=1,ClipsDescendants=true,ZIndex=4},W)

    -- PAGE / TAB SYSTEM
    local pages,tabs,activeTab={},{},nil
    local function mkPage(name)
        local p=New("ScrollingFrame",{Name=name,Size=UDim2.new(1,0,1,0),BackgroundTransparency=1,Visible=false,ScrollBarThickness=3,ScrollBarImageColor3=T.V,CanvasSize=UDim2.new(0,0,0,0),AutomaticCanvasSize=Enum.AutomaticSize.Y,ZIndex=5},CA)
        List(p,Enum.FillDirection.Vertical,8,Enum.HorizontalAlignment.Center); Pad(p,12,16,10,10)
        pages[name]=p; return p
    end
    local function mkTab(icon,lbl,pg)
        local b=New("TextButton",{Text="",Size=UDim2.new(1,0,0,72),BackgroundColor3=T.ELEM,BackgroundTransparency=0.7,ZIndex=7},SB); Corner(b,10)
        local ic=New("TextLabel",{Text=icon,Size=UDim2.new(1,0,0,30),Position=UDim2.new(0,0,0,8),Font=Enum.Font.GothamBold,TextSize=20,TextColor3=T.MID,BackgroundTransparency=1,ZIndex=8},b)
        local lb=New("TextLabel",{Text=lbl,Size=UDim2.new(1,-4,0,16),Position=UDim2.new(0,2,0,38),Font=Enum.Font.Gotham,TextSize=9,TextColor3=T.LO,BackgroundTransparency=1,ZIndex=8},b)
        local ind=New("Frame",{Size=UDim2.new(0,3,0,32),Position=UDim2.new(0,0,0.5,-16),BackgroundColor3=T.V,BackgroundTransparency=1,BorderSizePixel=0,ZIndex=9},b); Corner(ind,3)
        b.MouseEnter:Connect(function() if pg~=activeTab then Tw(b,{BackgroundTransparency=0.5},0.15) end end)
        b.MouseLeave:Connect(function() if pg~=activeTab then Tw(b,{BackgroundTransparency=0.7},0.15) end end)
        b.MouseButton1Click:Connect(function()
            for n in pairs(pages) do if pages[n] then pages[n].Visible=false end end
            for n,t in pairs(tabs) do Tw(t.b,{BackgroundTransparency=0.7},0.18); Tw(t.ic,{TextColor3=T.MID},0.18); Tw(t.lb,{TextColor3=T.LO},0.18); Tw(t.ind,{BackgroundTransparency=1},0.18) end
            activeTab=pg; if pages[pg] then pages[pg].Visible=true end
            Tw(b,{BackgroundTransparency=0.2},0.2); Tw(ic,{TextColor3=T.V},0.2); Tw(lb,{TextColor3=T.V},0.2); Tw(ind,{BackgroundTransparency=0},0.2)
        end)
        tabs[pg]={b=b,ic=ic,lb=lb,ind=ind}; return b
    end

    -- ── HOME PAGE ──
    local pH=mkPage("home")
    local hero=New("Frame",{Size=UDim2.new(1,0,0,100),BackgroundColor3=Color3.fromRGB(14,8,38),BackgroundTransparency=0.1,ZIndex=6},pH)
    Corner(hero,14); Stroke(hero,T.V,1.5,0.55); Grad(hero,Color3.fromRGB(22,10,55),T.BG,145)
    local ht=New("TextLabel",{Text="⚡ CCRAFT SPACE",Size=UDim2.new(1,-16,0,30),Position=UDim2.new(0,14,0,12),Font=Enum.Font.GothamBold,TextSize=18,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},hero); Grad(ht,T.V,T.C,90)
    New("TextLabel",{Text="منصة سكربتات Roblox العربية",Size=UDim2.new(1,-16,0,18),Position=UDim2.new(0,14,0,44),Font=Enum.Font.Gotham,TextSize=11,TextColor3=T.MID,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},hero)
    New("TextLabel",{Text="v"..CC.Version.."  •  "..CC.Website,Size=UDim2.new(1,-16,0,14),Position=UDim2.new(0,14,0,66),Font=Enum.Font.GothamMedium,TextSize=9,TextColor3=T.LO,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},hero)

    local ir=New("Frame",{Size=UDim2.new(1,0,0,44),BackgroundTransparency=1,ZIndex=6},pH)
    List(ir,Enum.FillDirection.Horizontal,7,Enum.HorizontalAlignment.Left)
    local function IBadge(icon,lbl,val,col)
        local f=New("Frame",{Size=UDim2.new(0,124,1,0),BackgroundColor3=T.CARD,BackgroundTransparency=0.4,ZIndex=7},ir); Corner(f,10); Stroke(f,col or T.BORDER,1,0.6)
        New("TextLabel",{Text=icon.." "..lbl,Size=UDim2.new(1,-4,0,16),Position=UDim2.new(0,6,0,4),Font=Enum.Font.Gotham,TextSize=9,TextColor3=T.LO,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},f)
        local v=New("TextLabel",{Text=val,Size=UDim2.new(1,-4,0,18),Position=UDim2.new(0,6,0,22),Font=Enum.Font.GothamBold,TextSize=13,TextColor3=col or T.HI,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},f)
        return v
    end
    local scVal=IBadge("📜","السكربتات","...",T.V)
    IBadge("👤","اللاعب",LP.Name,T.C)
    IBadge("🎮","اللعبة",(game:IsLoaded() and game.Name or "..."):sub(1,14),T.G)

    local cs=New("Frame",{Size=UDim2.new(1,0,0,0),AutomaticSize=Enum.AutomaticSize.Y,BackgroundTransparency=1,ZIndex=6},pH)
    List(cs,Enum.FillDirection.Vertical,6)
    CC._cSection=cs

    -- ── SCRIPTS PAGE ──
    local pS=mkPage("scripts")
    local sw=New("Frame",{Size=UDim2.new(1,0,0,36),BackgroundColor3=T.ELEM,BackgroundTransparency=0.3,ZIndex=6},pS); Corner(sw,10); Stroke(sw,T.BORDER,1,0.5)
    New("TextLabel",{Text="🔍",Size=UDim2.new(0,28,1,0),Position=UDim2.new(0,4,0,0),Font=Enum.Font.Gotham,TextSize=14,BackgroundTransparency=1,ZIndex=7},sw)
    local SB2=New("TextBox",{PlaceholderText="ابحث عن سكربت...",Text="",Size=UDim2.new(1,-38,1,-8),Position=UDim2.new(0,32,0,4),Font=Enum.Font.Gotham,TextSize=12,TextColor3=T.HI,PlaceholderColor3=T.LO,BackgroundTransparency=1,ClearTextOnFocus=false,ZIndex=7,TextXAlignment=Enum.TextXAlignment.Right},sw)

    local fr=New("Frame",{Size=UDim2.new(1,0,0,26),BackgroundTransparency=1,ZIndex=6},pS)
    List(fr,Enum.FillDirection.Horizontal,5,Enum.HorizontalAlignment.Right)
    local cats={"الكل","game","admin","ai"}
    local catC={T.MID,T.G,T.R,T.V}
    local catI={"🌟","🎮","🛡️","🤖"}
    local fB={}; local aCat="الكل"
    for i,cat in ipairs(cats) do
        local fb=New("TextButton",{Text=catI[i].." "..cat,Size=UDim2.new(0,0,1,0),AutomaticSize=Enum.AutomaticSize.X,Font=Enum.Font.GothamBold,TextSize=10,TextColor3=i==1 and catC[i] or T.LO,BackgroundColor3=catC[i],BackgroundTransparency=i==1 and 0.78 or 0.92,ZIndex=7},fr)
        Corner(fb,7); Pad(fb,0,0,8,8); fB[cat]=fb
    end

    local sl=New("Frame",{Size=UDim2.new(1,0,0,0),AutomaticSize=Enum.AutomaticSize.Y,BackgroundTransparency=1,ZIndex=6},pS)
    List(sl,Enum.FillDirection.Vertical,7)
    local stLbl=New("TextLabel",{Text="⏳ جارٍ الاتصال بالخادم...",Size=UDim2.new(1,0,0,40),Font=Enum.Font.Gotham,TextSize=12,TextColor3=T.LO,BackgroundTransparency=1,ZIndex=7,TextWrapped=true},sl)

    -- script card builder
    local function mkSCard(parent,s,idx)
        local acc=({game=T.G,admin=T.R,ai=T.V})[s.category] or T.C
        local card=New("Frame",{Size=UDim2.new(1,0,0,86),BackgroundColor3=T.CARD,BackgroundTransparency=0.35,ZIndex=7,LayoutOrder=idx},parent)
        Corner(card,12); Stroke(card,T.BORDER,1,0.5)
        local al=New("Frame",{Size=UDim2.new(0,3,1,-18),Position=UDim2.new(0,0,0,9),BackgroundColor3=acc,BorderSizePixel=0,ZIndex=8},card); Corner(al,3)
        New("TextLabel",{Text=s.title,Size=UDim2.new(1,-100,0,20),Position=UDim2.new(0,12,0,8),Font=Enum.Font.GothamBold,TextSize=13,TextColor3=T.HI,BackgroundTransparency=1,TextTruncate=Enum.TextTruncate.AtEnd,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},card)
        New("TextLabel",{Text="👤 "..s.author.."  👍 "..s.likes..(s.map~="" and "  🗺️ "..s.map or ""),Size=UDim2.new(1,-14,0,15),Position=UDim2.new(0,12,0,30),Font=Enum.Font.Gotham,TextSize=10,TextColor3=T.LO,BackgroundTransparency=1,TextTruncate=Enum.TextTruncate.AtEnd,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=8},card)
        local cb2=New("TextLabel",{Text=(s.category~="" and "📁 "..s.category or "—"),Size=UDim2.new(0,0,0,18),AutomaticSize=Enum.AutomaticSize.X,Position=UDim2.new(0,12,0,50),Font=Enum.Font.GothamBold,TextSize=9,TextColor3=acc,BackgroundColor3=acc,BackgroundTransparency=0.84,ZIndex=8},card); Corner(cb2,6); Pad(cb2,0,0,7,7)
        local EB=New("TextButton",{Text="▶ تشغيل",Size=UDim2.new(0,74,0,26),Position=UDim2.new(1,-84,0,30),Font=Enum.Font.GothamBold,TextSize=11,TextColor3=T.HI,BackgroundColor3=acc,BackgroundTransparency=0.2,ZIndex=9},card); Corner(EB,8)
        local CPB=New("TextButton",{Text="📋",Size=UDim2.new(0,26,0,26),Position=UDim2.new(1,-84,0,0),Font=Enum.Font.GothamBold,TextSize=13,TextColor3=T.MID,BackgroundColor3=T.ELEM,BackgroundTransparency=0.4,ZIndex=9},card); Corner(CPB,8)
        card.MouseEnter:Connect(function() Tw(card,{BackgroundTransparency=0.15},0.15) end)
        card.MouseLeave:Connect(function() Tw(card,{BackgroundTransparency=0.35},0.15) end)
        EB.MouseButton1Click:Connect(function()
            Tw(EB,{BackgroundTransparency=0},0.08); task.wait(0.1); Tw(EB,{BackgroundTransparency=0.2},0.15)
            local ok,fn=pcall(loadstring,s.code)
            if ok and type(fn)=="function" then
                local ok2,e2=pcall(fn)
                if ok2 then CC.Notify("✅ تم التشغيل",s.title,3,"success")
                else CC.Notify("❌ خطأ في التشغيل",tostring(e2):sub(1,60),4,"error") end
            else CC.Notify("❌ خطأ في الكود",tostring(fn):sub(1,60),4,"error") end
        end)
        CPB.MouseButton1Click:Connect(function()
            pcall(function() setclipboard(s.code) end)
            CC.Notify("📋 تم النسخ",s.title,2,"info"); CPB.Text="✅"
            task.wait(1.5); CPB.Text="📋"
        end)
    end

    local allS={}; local sQ=""; local aCatV="الكل"
    local function render()
        for _,c in ipairs(sl:GetChildren()) do if c:IsA("Frame") then c:Destroy() end end
        local f={}
        for _,s in ipairs(allS) do
            local mc=aCatV=="الكل" or s.category==aCatV
            local mq=sQ=="" or s.title:lower():find(sQ:lower(),1,true) or s.author:lower():find(sQ:lower(),1,true) or (s.map~="" and s.map:lower():find(sQ:lower(),1,true))
            if mc and mq then table.insert(f,s) end
        end
        if #f==0 then stLbl.Text="🔍 لا توجد نتائج"; stLbl.Visible=true
        else stLbl.Visible=false
            for i,s in ipairs(f) do mkSCard(sl,s,i); if i%5==0 then task.wait() end end
        end
    end
    for _,cat in ipairs(cats) do
        local idx=table.find(cats,cat)
        fB[cat].MouseButton1Click:Connect(function()
            aCatV=cat
            for _,c2 in ipairs(cats) do
                local i2=table.find(cats,c2)
                Tw(fB[c2],{BackgroundTransparency=c2==cat and 0.78 or 0.92,TextColor3=c2==cat and catC[i2] or T.LO},0.15)
            end
            render()
        end)
    end
    SB2:GetPropertyChangedSignal("Text"):Connect(function() sQ=SB2.Text; render() end)

    task.spawn(function()
        task.wait(0.6)
        allS=FetchScripts()
        if #allS>0 then
            scVal.Text=tostring(#allS); stLbl.Visible=false
            CC.Notify("✅ تم التحميل","تم تحميل "..#allS.." سكربت",3,"success")
            render()
        else
            stLbl.Text="❌ تعذّر التحميل\nتأكد من تفعيل HTTP في إعدادات اللعبة"
            CC.Notify("❌ فشل الاتصال","تحقق من HTTP Enabled في Studio",4,"error")
        end
    end)

    -- ── CUSTOM PAGE ──
    local pC=mkPage("custom")
    New("TextLabel",{Text="🔌 مكتبات مخصصة",Size=UDim2.new(1,0,0,24),Font=Enum.Font.GothamBold,TextSize=14,TextColor3=T.HI,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Right,ZIndex=6},pC)
    New("TextLabel",{Text="الأزرار المضافة من CC.AddButton()\nتظهر هنا وفي صفحة الرئيسية تلقائياً",Size=UDim2.new(1,0,0,36),Font=Enum.Font.Gotham,TextSize=10,TextColor3=T.LO,BackgroundTransparency=1,TextWrapped=true,TextXAlignment=Enum.TextXAlignment.Right,ZIndex=6},pC)
    local cPL=New("Frame",{Size=UDim2.new(1,0,0,0),AutomaticSize=Enum.AutomaticSize.Y,BackgroundTransparency=1,ZIndex=6},pC)
    List(cPL,Enum.FillDirection.Vertical,7); CC._cPageList=cPL

    -- ── SETTINGS PAGE ──
    local pSt=mkPage("settings")
    New("TextLabel",{Text="⚙️ الإعدادات",Size=UDim2.new(1,0,0,24),Font=Enum.Font.GothamBold,TextSize=14,TextColor3=T.HI,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Right,ZIndex=6},pSt)
    for _,row in ipairs({{T.V,"🌐","الموقع",CC.Website},{T.C,"👤","اللاعب",LP.Name},{T.G,"🎮","اللعبة",(game:IsLoaded() and game.Name or "..."):sub(1,18)},{T.GO,"📦","الإصدار","v"..CC.Version},{T.MID,"📋","الترخيص","MIT — مفتوح المصدر"}}) do
        local sc=New("Frame",{Size=UDim2.new(1,0,0,48),BackgroundColor3=T.CARD,BackgroundTransparency=0.4,ZIndex=6},pSt); Corner(sc,12); Stroke(sc,T.BORDER,1,0.6)
        New("TextLabel",{Text=row[2].."  "..row[3],Size=UDim2.new(0.55,0,0,20),Position=UDim2.new(0,12,0,7),Font=Enum.Font.GothamBold,TextSize=11,TextColor3=row[1],BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},sc)
        New("TextLabel",{Text=row[4],Size=UDim2.new(1,-14,0,17),Position=UDim2.new(0,12,0,26),Font=Enum.Font.Gotham,TextSize=10,TextColor3=T.MID,BackgroundTransparency=1,TextTruncate=Enum.TextTruncate.AtEnd,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},sc)
    end
    local oc=New("Frame",{Size=UDim2.new(1,0,0,58),BackgroundColor3=Color3.fromRGB(8,22,8),BackgroundTransparency=0.3,ZIndex=6},pSt); Corner(oc,12); Stroke(oc,T.G,1.5,0.6)
    New("TextLabel",{Text="✅ مكتبة مفتوحة المصدر (MIT)",Size=UDim2.new(1,-14,0,20),Position=UDim2.new(0,12,0,8),Font=Enum.Font.GothamBold,TextSize=12,TextColor3=T.G,BackgroundTransparency=1,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},oc)
    New("TextLabel",{Text="مسموح لأي شخص يطور أو يعدل أو يضيف\nميزات جديدة لهذه المكتبة",Size=UDim2.new(1,-14,0,30),Position=UDim2.new(0,12,0,26),Font=Enum.Font.Gotham,TextSize=9,TextColor3=T.MID,BackgroundTransparency=1,TextWrapped=true,TextXAlignment=Enum.TextXAlignment.Left,ZIndex=7},oc)

    -- BUILD TABS
    mkTab("🏠","الرئيسية","home")
    mkTab("📜","السكربتات","scripts")
    mkTab("🔌","إضافات","custom")
    mkTab("⚙️","الإعدادات","settings")

    -- CLOSE / MINIMIZE
    local isMin=false
    BClose.MouseButton1Click:Connect(function()
        Tw(W,{Size=UDim2.new(0,0,0,0),Position=UDim2.new(0.5,0,0.5,0)},0.35,Enum.EasingStyle.Back,Enum.EasingDirection.In)
        task.wait(0.4); SG:Destroy(); CC._gui=nil; CC._open=false
    end)
    BMin.MouseButton1Click:Connect(function()
        isMin=not isMin
        if isMin then Tw(W,{Size=UDim2.new(0,540,0,48)},0.28); BMin.Text="□"
        else Tw(W,{Size=UDim2.new(0,540,0,560)},0.35,Enum.EasingStyle.Back); BMin.Text="—" end
    end)

    MakeDraggable(W,TB)

    -- OPEN ANIMATION
    W.Size=UDim2.new(0,0,0,0); W.Position=UDim2.new(0.5,0,0.5,0)
    Tw(W,{Size=UDim2.new(0,540,0,560),Position=UDim2.new(0.5,-270,0.5,-280)},0.55,Enum.EasingStyle.Back)
    task.wait(0.18); if tabs["home"] then tabs["home"].b:SimulateClick() end

    CC._refresh()
    CC.Notify("⚡ "..CC.Name,"أهلاً "..LP.Name.."! RightShift للإغلاق",3,"info")
end

function CC.Close()
    if CC._gui then CC._gui:Destroy(); CC._gui=nil; CC._open=false end
end

function CC.Toggle()
    if CC._open then CC.Close() else CC.Open() end
end

-- Keybind
UserInputService.InputBegan:Connect(function(i,gpe)
    if gpe then return end
    if i.KeyCode==Enum.KeyCode.RightShift then CC.Toggle() end
end)

-- Auto open
CC.Open()

return CC
