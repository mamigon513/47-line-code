//  set variables
let lwheel = 20
let rwheel = 20
let error = 0
//  which line are we following:
let line = -1
//  0 is left, 1 is right
let maxturnspeed = 50
// magnet present
let mag = 0
//  set starting speed
CutebotPro.pwmCruiseControl(lwheel, rwheel)
basic.pause(50)
function turn_right() {
    
    lwheel = lwheel + Math.abs(error) / 3000 * maxturnspeed
    rwheel = rwheel - Math.abs(error) / 3000 * maxturnspeed
    //  Set the change
    CutebotPro.pwmCruiseControl(lwheel, rwheel)
    // delay 0.05 sec
    // delay 0.01 sec
    basic.pause(10)
}

function turn_left() {
    
    lwheel = lwheel - Math.abs(error) / 3000 * maxturnspeed
    rwheel = rwheel + Math.abs(error) / 3000 * maxturnspeed
    //  Set the change
    CutebotPro.pwmCruiseControl(lwheel, rwheel)
    // delay 0.05 sec
    // delay 0.01 sec
    basic.pause(10)
}

function magnet() {
    
    if (Math.abs(input.magneticForce(Dimension.X)) >= 500) {
        mag = 1
        //  turn headlights green
        CutebotPro.colorLight(CutebotProRGBLight.RGBL, 0x00ff00)
        CutebotPro.colorLight(CutebotProRGBLight.RGBR, 0x00ff00)
    }
    
}

function follow_line() {
    
    //  get the line offset
    error = CutebotPro.getOffset()
    //  make the left side of line the center
    // error = error + 1000
    //  if detects no line
    if (Math.abs(error) == 3000) {
        lwheel = 0
        rwheel = 0
        // turn on both headlight (red)
        CutebotPro.colorLight(CutebotProRGBLight.RGBL, 0xff0000)
        CutebotPro.colorLight(CutebotProRGBLight.RGBR, 0xff0000)
    }
    
    //  if detects a big line
    // ### Intersection ####
    //  if detects a big line (error is less than 100)
    if (Math.abs(error) < 100) {
        if (error > 0) {
            //  robot is to the left of intersection (make a big right turn)
            error = 3000 / error
            turn_right()
            basic.pause(100)
            // yellow light
            CutebotPro.colorLight(CutebotProRGBLight.RGBL, 0xffff00)
        } else if (error < 0) {
            //  robot is to the right of intersection (make a big left turn)
            error = 3000 / error
            turn_left()
            basic.pause(100)
            // yellow light
            CutebotPro.colorLight(CutebotProRGBLight.RGBR, 0xffff00)
        }
        
    }
    
    //  too far left
    if (error > 0) {
        turn_right()
        line = 1
        //  line is to the right
        //  turn on left headlight (red)
        CutebotPro.colorLight(CutebotProRGBLight.RGBL, 0xff0000)
    }
    
    //  too far right
    if (error < 0) {
        turn_left()
        line = 0
        //  line is to the left
        // turn on right headlight (red)
        CutebotPro.colorLight(CutebotProRGBLight.RGBR, 0xff0000)
    }
    
    //  reset speed and headlights
    CutebotPro.turnOffAllHeadlights()
    lwheel = 10
    rwheel = 10
    CutebotPro.pwmCruiseControl(lwheel, rwheel)
    basic.pause(5)
    magnet()
}

// basic.forever(on_forever)
//  Run line follow till magnet detected then stop
while (mag == 0) {
    follow_line()
}
//  stop robot
CutebotPro.pwmCruiseControl(0, 0)
basic.pause(100)
CutebotPro.turnOffAllHeadlights()
