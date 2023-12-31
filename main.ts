input.onButtonPressed(Button.AB, function () {
    stop_servos()
    basic.showIcon(IconNames.SmallSquare)
})
input.onButtonPressed(Button.A, function () {
    REQUESTED_FLOOR += 1
    if (REQUESTED_FLOOR >= 3) {
        REQUESTED_FLOOR = 0
    }
    basic.showNumber(REQUESTED_FLOOR)
})
function stop_servos () {
    SERVO_IS_TURNING = false
    DIRECTION = 0
    wuKong.stopMotor(wuKong.MotorList.M1)
    wuKong.stopMotor(wuKong.MotorList.M2)
}
input.onButtonPressed(Button.B, function () {
    if (REQUESTED_FLOOR > CURRENT_FLOOR) {
        DIRECTION = 1
        SERVO_IS_TURNING = true
        wuKong.setMotorSpeed(wuKong.MotorList.M1, SERVO_SPEED)
        basic.showNumber(CURRENT_FLOOR)
    } else if (REQUESTED_FLOOR < CURRENT_FLOOR) {
        DIRECTION = 2
        SERVO_IS_TURNING = true
        wuKong.setMotorSpeed(wuKong.MotorList.M1, 0 - SERVO_SPEED)
        basic.showNumber(CURRENT_FLOOR)
    }
})
let BETWEEN_FLOORS = false
let SENSOR_DISTANCE = 0
let DIRECTION = 0
let SERVO_IS_TURNING = false
let REQUESTED_FLOOR = 0
let CURRENT_FLOOR = 0
let SERVO_SPEED = 0
SERVO_SPEED = 14
let led_strip = neopixel.create(DigitalPin.P16, 4, NeoPixelMode.RGB)
led_strip.showColor(neopixel.colors(NeoPixelColors.Black))
stop_servos()
basic.showNumber(CURRENT_FLOOR)
basic.forever(function () {
    SENSOR_DISTANCE = grove.measureInCentimeters(DigitalPin.P8)
    if (SERVO_IS_TURNING) {
        if (SENSOR_DISTANCE >= 30) {
            if (!(BETWEEN_FLOORS)) {
                BETWEEN_FLOORS = true
                // is needed to give the time to really switch to next area
                basic.pause(200)
            }
        } else if (SENSOR_DISTANCE <= 5) {
            if (BETWEEN_FLOORS) {
                BETWEEN_FLOORS = false
                if (DIRECTION == 1) {
                    CURRENT_FLOOR += 1
                } else if (DIRECTION == 2) {
                    CURRENT_FLOOR += -1
                }
                // Showing microbit leds delays reactions
                if (CURRENT_FLOOR == REQUESTED_FLOOR) {
                    stop_servos()
                }
                basic.showNumber(CURRENT_FLOOR)
                if (CURRENT_FLOOR == REQUESTED_FLOOR) {
                    led_strip.showColor(neopixel.colors(NeoPixelColors.Green))
                    basic.pause(500)
                    led_strip.showColor(neopixel.colors(NeoPixelColors.Black))
                }
            }
        }
    }
    basic.pause(200)
})
