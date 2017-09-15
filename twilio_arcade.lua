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

function press_button(player, button, frames)
    input_table = {}
    input_table[button] = true

    -- Hold the button down for some number of frames.
    for i=1, frames do
        joypad.set(player, input_table)
        emu.frameadvance()
    end
end

buttons = { 'A', 'B', 'X', 'Y', 'up', 'down', 'left', 'right', 'start', 'select' }

while true do
    button = read_file('p1.txt')
    if button ~= nil then
        if has_value(buttons, button) then
            emu.message('Pressing: ' .. button)

            -- Press player 1's button for 5 frames.
            press_button(1, button, 30)
            os.remove('p1.txt')
        end
    end

    emu.frameadvance()
end
