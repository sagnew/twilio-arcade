function read_file(filename)
    local input = io.open(filename, 'r')
    if input ~= nil then
        io.input(input)
        input_content = io.read()
        io.close(input)

        return input_content
    end

    return nil
end

function file_exists(filename)
    f = io.open(filename, 'r')

    if f ~= nil then
        io.close(f)
        return true
    else
        io.close(f)
        return false
    end
end

function has_value (tab, val)
    for index, value in ipairs (tab) do
        if value == val then
            return true
        end
    end

    return false
end

-- Presses buttons for both players for a given number of frames.
function press_buttons(p1_button, p2_button, frames)
    p1_table = {}
    p2_table = {}

    -- Hold the button down for some number of frames.
    for i=1, frames do
        if has_value(buttons, p1_button) then
            p1_table[p1_button] = true
            joypad.set(1, p1_table)
        end

        if has_value(buttons, p2_button) then
            p2_table[p2_button] = true
            joypad.set(2, p2_table)
        end

        emu.frameadvance()
    end
end

buttons = { 'A', 'B', 'X', 'Y', 'up', 'down', 'left', 'right', 'start', 'select' }

while true do
    p1_button = read_file('p1.txt')
    p2_button = read_file('p2.txt')

    if p1_button ~= nil or p2_button ~= nil then

        press_buttons(p1_button, p2_button, 10)
        os.remove('p1.txt')
        os.remove('p2.txt')
    end

    emu.frameadvance()
end
