/**
 * Lesson Data Structure
 * 
 * This file contains all lesson content organized by IF MAGIC modules.
 * 
 * Instead of hardcoding lesson content in components, we separate DATA from PRESENTATION.
 * 
 * Benefits:
 * 1. Easy to add/edit lessons without touching React code
 * 2. Could be moved to a backend/database later
 * 3. Keeps components clean and focused on display logic
 * 4. Easier to test and maintain
 */

// User skill level types
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

// Helper to generate URL-friendly slugs from titles
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .trim();
};

export interface Lesson {
  id: number;
  slug: string; // URL-friendly identifier based on title
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'available' | 'locked';
  module?: string; // IF MAGIC module name
  category: 'getting-started' | 'foundation' | 'sensor' | 'output' | 'advanced';
  requiredLevel: UserLevel; // NEW: Minimum user level required
  path?: 'getting-started' | 'ifmagic'; // Which learning path this belongs to
  content: {
    overview: string;
    videoUrl?: string;
    sections: {
      title: string;
      text: string;
      codeExample?: string;
    }[];
    practiceActivity?: string;
    resources: {
      title: string;
      url: string;
    }[];
  };
}

/**
 * Lessons based on IF MAGIC modules
 * Source: https://docs.ifmagic.io
 * 
 * Structure follows a learning path:
 * 0. Getting Started - Universal intro for all paths
 * 1. Foundation - Platform basics
 * 2. Input Sensors - Reading data from modules
 * 3. Output Control - Controlling modules
 * 4. Advanced - Combining modules with equations
 */
export const lessons: Lesson[] = [
  // ==========================================
  // GETTING STARTED PATH - Required for all users
  // ==========================================
  {
    id: 0,
    slug: 'welcome-to-hardwarehub',
    title: "Welcome to HardwareHub",
    description: "Your first steps into embedded programming. Learn what embedded systems are and why they matter.",
    duration: "5 min",
    status: 'available',
    category: 'getting-started',
    path: 'getting-started',
    requiredLevel: 'beginner',
    content: {
      overview: "Welcome! This lesson introduces you to embedded systems and sets you up for success on your learning journey.",
      sections: [
        {
          title: "What is Embedded Programming?",
          text: "Embedded programming is writing code that runs on small computers (microcontrollers) inside everyday devices. Your phone, car, washing machine, and even traffic lights all contain embedded systems!"
        },
        {
          title: "Why Learn Embedded Systems?",
          text: "Embedded systems are everywhere! Learning to program them opens doors to IoT (Internet of Things), robotics, home automation, wearables, and countless other exciting fields. It's where software meets the physical world."
        },
        {
          title: "What You'll Learn",
          text: "In HardwareHub, you'll progress from complete beginner to building real projects. We'll start with concepts, then move to hands-on work with actual hardware. No prior experience required!"
        }
      ],
      practiceActivity: "Explore the HardwareHub interface. Click through the navigation and familiarize yourself with the layout.",
      resources: [
        {
          title: "What is an Embedded System? (Video)",
          url: "https://www.youtube.com/watch?v=embedded-intro"
        },
        {
          title: "History of Microcontrollers",
          url: "https://en.wikipedia.org/wiki/Microcontroller"
        }
      ]
    }
  },
  {
    id: -1,
    slug: 'understanding-hardware-basics',
    title: "Understanding Hardware Basics",
    description: "Learn the fundamental components you'll encounter: microcontrollers, sensors, and actuators.",
    duration: "8 min",
    status: 'available',
    category: 'getting-started',
    path: 'getting-started',
    requiredLevel: 'beginner',
    content: {
      overview: "Before touching real hardware, let's understand what the pieces are and how they work together.",
      sections: [
        {
          title: "The Microcontroller - The Brain",
          text: "A microcontroller (MCU) is a tiny computer on a single chip. It has a processor, memory, and input/output pins. Unlike your laptop, it's designed to do one job really well and use very little power."
        },
        {
          title: "Sensors - The Senses",
          text: "Sensors detect the physical world: temperature, light, motion, distance, touch, and more. They convert physical phenomena into electrical signals the microcontroller can read."
        },
        {
          title: "Actuators - The Muscles",
          text: "Actuators create physical effects: LEDs light up, motors spin, speakers make sound, displays show text. They convert electrical signals into actions in the real world."
        },
        {
          title: "Putting It Together",
          text: "A typical embedded project: Sensor detects something → Microcontroller processes the data → Actuator responds. Example: Motion sensor detects you → MCU decides it's dark → LED turns on!"
        }
      ],
      practiceActivity: "Look around your home and identify 3 devices that likely contain embedded systems. What sensors and actuators might they have?",
      resources: [
        {
          title: "Types of Sensors Explained",
          url: "https://www.electronics-tutorials.ws/io/sensors.html"
        }
      ]
    }
  },
  {
    id: -2,
    slug: 'thinking-like-a-programmer',
    title: "Thinking Like a Programmer",
    description: "Develop the problem-solving mindset essential for embedded programming.",
    duration: "10 min",
    status: 'available',
    category: 'getting-started',
    path: 'getting-started',
    requiredLevel: 'beginner',
    content: {
      overview: "Programming is more about thinking than typing. Learn the mental models that make coding easier.",
      sections: [
        {
          title: "Break It Down",
          text: "The #1 skill in programming: breaking big problems into small steps. Want a light that turns on when it's dark? Step 1: Read light level. Step 2: Compare to threshold. Step 3: Control LED. Simple pieces = solvable problems."
        },
        {
          title: "Input → Process → Output",
          text: "Almost every program follows this pattern. Something comes IN (button press, sensor reading), you PROCESS it (make a decision, do math), and something goes OUT (LED, sound, motor). Remember IPO!"
        },
        {
          title: "Start Simple, Then Iterate",
          text: "Don't try to build everything at once. Get a tiny version working first. Make the LED blink. Then add the button. Then add the sensor. Small wins build to big projects."
        },
        {
          title: "Debugging is Learning",
          text: "Your code won't work the first time. That's normal! Debugging teaches you more than getting it right. When something fails, you're about to learn something new."
        }
      ],
      practiceActivity: "Write down the steps (in plain English) to make a nightlight that turns on automatically when it gets dark. Use the IPO pattern.",
      resources: [
        {
          title: "Computational Thinking Explained",
          url: "https://www.cs.cmu.edu/~CompThink/"
        }
      ]
    }
  },
  {
    id: -3,
    slug: 'choosing-your-hardware-path',
    title: "Choosing Your Hardware Path",
    description: "Understand the different hardware platforms and choose the right one for your goals.",
    duration: "7 min",
    status: 'available',
    category: 'getting-started',
    path: 'getting-started',
    requiredLevel: 'beginner',
    content: {
      overview: "Different hardware platforms have different strengths. Let's help you pick the right one.",
      sections: [
        {
          title: "IF MAGIC - Best for Beginners",
          text: "IF MAGIC uses modular, plug-and-play components. No soldering, no complex wiring. Perfect for learning concepts without getting stuck on hardware issues. Recommended if you're brand new!"
        },
        {
          title: "Arduino - The Classic Choice",
          text: "Arduino has been the go-to learning platform for years. Huge community, tons of tutorials, works with thousands of accessories. Great stepping stone to professional development."
        },
        {
          title: "ESP32 - WiFi & Bluetooth Built-in",
          text: "ESP32 is perfect for IoT projects. Built-in wireless means you can connect your projects to the internet. More powerful than Arduino, but slightly steeper learning curve."
        },
        {
          title: "Raspberry Pi Pico - Affordable Power",
          text: "The Pico offers professional-level features at a hobby price. Dual-core processor, PIO for custom protocols. Great for intermediate learners ready for more."
        }
      ],
      practiceActivity: "Based on what you've learned, decide which platform you want to start with. Remember: IF MAGIC is recommended for complete beginners!",
      resources: [
        {
          title: "IF MAGIC Documentation",
          url: "https://docs.ifmagic.io"
        },
        {
          title: "Arduino vs ESP32 Comparison",
          url: "https://makeradvisor.com/arduino-vs-esp32/"
        }
      ]
    }
  },
  {
    id: -4,
    slug: 'setting-up-your-learning-environment',
    title: "Setting Up Your Learning Environment",
    description: "Get your computer ready for embedded development and complete your first milestone!",
    duration: "12 min",
    status: 'available',
    category: 'getting-started',
    path: 'getting-started',
    requiredLevel: 'beginner',
    content: {
      overview: "Let's set up your development environment and make sure everything works before diving into real projects.",
      sections: [
        {
          title: "What You'll Need",
          text: "A computer (Windows, Mac, or Linux all work), a USB cable for connecting hardware, and optionally your chosen hardware platform. Don't have hardware yet? No problem - we'll use simulators first!"
        },
        {
          title: "Installing the Software",
          text: "For IF MAGIC: Download the IF MAGIC app from their website. For Arduino/ESP32: Install the Arduino IDE or PlatformIO. For simulations: We'll use Wokwi, a free online simulator that works in your browser."
        },
        {
          title: "Your First Test",
          text: "Let's verify your setup works! For IF MAGIC users: Open the app and connect your device. For others: Open your IDE and create a new project. If you see a blank editor, you're ready!"
        },
        {
          title: "Congratulations!",
          text: "You've completed the Getting Started path! You now understand what embedded systems are, how they work, and you've got your environment ready. Time to pick a learning path and build something real!"
        }
      ],
      practiceActivity: "Complete your environment setup. If using IF MAGIC, connect your device. If using Arduino/ESP32, create a new project in your IDE. Mark this lesson complete to unlock other learning paths!",
      resources: [
        {
          title: "IF MAGIC App Download",
          url: "https://ifmagic.io/download"
        },
        {
          title: "Arduino IDE Download",
          url: "https://www.arduino.cc/en/software"
        },
        {
          title: "Wokwi Online Simulator",
          url: "https://wokwi.com"
        }
      ]
    }
  },
  // ==========================================
  // IF MAGIC PATH - Foundation Lessons
  // ==========================================
  {
    id: 1,
    slug: 'welcome-to-if-magic',
    title: "Welcome to IF MAGIC",
    description: "Get started with IF MAGIC platform basics, connecting your device, and understanding the ecosystem.",
    duration: "10 min",
    status: 'available',
    category: 'foundation',
    path: 'ifmagic',
    requiredLevel: 'beginner',
    content: {
      overview: "Learn the fundamentals of the IF MAGIC platform and how embedded systems work with modular hardware.",
      sections: [
        {
          title: "What is IF MAGIC?",
          text: "IF MAGIC is a modular hardware platform that lets you create interactive projects by connecting sensor and output modules to 'The Device'. Think of it as programmable building blocks for electronics!"
        },
        {
          title: "The Platform Components",
          text: "The Device: Your main hub that connects to modules. Modules: Plug-and-play sensors (Button, Distance, Light) and outputs (Glow, Sound). The App: Control and program everything through equations. API: Advanced programming for custom applications."
        },
        {
          title: "How It Works",
          text: "IF MAGIC uses a unique 'equation' system. Instead of writing traditional code, you create logic flows: Input Module → Processing → Output Module. This makes embedded programming visual and intuitive!"
        }
      ],
      practiceActivity: "Connect your IF MAGIC device and verify it shows up in the app.",
      resources: [
        {
          title: "IF MAGIC Documentation",
          url: "https://docs.ifmagic.io"
        },
        {
          title: "Magic in Minutes Guide",
          url: "https://docs.ifmagic.io/magic-in-minutes"
        }
      ]
    }
  },
  {
    id: 2,
    slug: 'setting-up-your-first-module',
    title: "Setting Up Your First Module",
    description: "Learn how to physically connect modules to The Device and configure them in the IF MAGIC app.",
    duration: "15 min",
    status: 'available',
    category: 'foundation',
    requiredLevel: 'beginner',
    content: {
      overview: "Master the basics of connecting and configuring IF MAGIC modules.",
      sections: [
        {
          title: "Plugging in a Module",
          text: "IF MAGIC modules connect magnetically to The Device. Each port can detect what type of module is connected automatically. Simply bring the module close to a port and it will snap into place!"
        },
        {
          title: "Module Detection",
          text: "Once connected, open the IF MAGIC app. The app will automatically detect your module and show its current state. You can rename modules, check their status, and configure settings."
        },
        {
          title: "Testing Your Module",
          text: "Try interacting with your module - press a button, move a slider, or shine light on a sensor. Watch the app respond in real-time. This is called 'streaming' - live data from your hardware!"
        }
      ],
      practiceActivity: "Connect a Button or Slider module and watch its values change in the app.",
      resources: [
        {
          title: "Device Basics",
          url: "https://docs.ifmagic.io/device-basics"
        },
        {
          title: "Plugging in a Module",
          url: "https://docs.ifmagic.io/plugging-in-a-module"
        }
      ]
    }
  },

  // INPUT SENSOR LESSONS - Beginner Modules
  {
    id: 3,
    slug: 'button-module-digital-input',
    title: "Button Module - Digital Input",
    description: "A digital input module that detects whether a physical button is pressed or not.",
    duration: "20 min",
    status: 'available',
    category: 'sensor',
    module: 'Button',
    requiredLevel: 'beginner',
    content: {
      overview: "The Button module is a digital input that detects whether a physical button is pressed or not.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that detects whether a physical button is pressed or not. Range consists of 0 or 1. 1 (true) corresponds to the button pressed, while 0 (false) corresponds to the button not pressed. This module can be connected to any digital port and is commonly used to trigger events or control program flow."
        },
        {
          title: "Output Values",
          text: "The button has two states: 0 (not pressed) and 1 (pressed). This binary output makes it perfect for simple on/off control and event triggering."
        },
        {
          title: "Code Example (JavaScript)",
          text: "var buttonState = Magic.modules.button.state;",
          codeExample: "var buttonState = Magic.modules.button.state;\n// Returns 0 (not pressed) or 1 (pressed)"
        },
        {
          title: "Common Uses",
          text: "Buttons are commonly used to: Trigger events when pressed, Control program flow (start/stop), Toggle states on and off, Create interactive user controls"
        }
      ],
      practiceActivity: "Connect a Button module and create an equation that prints the button state to the console.",
      resources: [
        {
          title: "Button Module Documentation",
          url: "https://docs.ifmagic.io/modules/button"
        }
      ]
    }
  },
  {
    id: 4,
    slug: 'slider-module-analog-input',
    title: "Slider Module - Analog Input",
    description: "Explore analog sensors with the Slider module. Learn about variable input and value mapping.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Slider',
    requiredLevel: 'beginner',
    content: {
      overview: "Analog inputs provide a range of values, not just ON/OFF. Perfect for controls like volume or brightness.",
      sections: [
        {
          title: "Understanding Analog Values",
          text: "Unlike buttons, sliders output a range of values (typically 0-100). As you move the slider, the value changes smoothly. This is called an 'analog signal'."
        },
        {
          title: "Value Mapping",
          text: "The slider's position translates to a number. IF MAGIC normalizes this to 0-100, making it easy to work with. You can map this value to control other things - like LED brightness or motor speed."
        },
        {
          title: "Real-World Applications",
          text: "Sliders are everywhere: volume controls, brightness adjusters, temperature settings. Understanding analog input is crucial for creating smooth, responsive interfaces."
        },
        {
          title: "Port Compatibility",
          text: "The Slider module works on ports 1-8, giving you complete flexibility in module placement."
        }
      ],
      practiceActivity: "Use the Slider to control the brightness of a Glow module.",
      resources: [
        {
          title: "Slider Module Documentation",
          url: "https://docs.ifmagic.io/modules/slider"
        }
      ]
    }
  },
  {
    id: 5,
    slug: 'dial-module-rotational-control',
    title: "Dial Module - Rotational Control",
    description: "Master rotational input with the Dial module. Learn to read angular position and create intuitive controls.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Dial',
    requiredLevel: 'beginner',
    content: {
      overview: "The Dial measures rotational change between fixed angles - perfect for knob-based controls.",
      sections: [
        {
          title: "How the Dial Works",
          text: "The Dial module detects rotation between 40° (leftmost) and 330° (rightmost). Unlike the Spin module, it doesn't rotate a full 360° - it has defined endpoints, just like a volume knob on a stereo."
        },
        {
          title: "Reading Dial Data",
          text: "The Dial provides two data types: Raw (0-4095) for high precision, and Degree (40-330) for angle measurements. Choose based on your needs - degrees for intuitive control, raw for fine-tuned precision."
        },
        {
          title: "Practical Applications",
          text: "Dials are perfect for: Volume controls, brightness adjustments, temperature settings, menu navigation. Any interface where you need smooth, bounded rotational input."
        },
        {
          title: "Port Compatibility",
          text: "The Dial module can be used on ports 1, 2, 7, and 8. Plan your module layout accordingly!"
        }
      ],
      practiceActivity: "Create a color picker that changes hue as you rotate the dial.",
      resources: [
        {
          title: "Dial Module Documentation",
          url: "https://docs.ifmagic.io/modules/dial"
        }
      ]
    }
  },
  {
    id: 6,
    slug: 'joystick-module-2d-input-control',
    title: "Joystick Module - 2D Input Control",
    description: "Explore two-dimensional input with the Joystick. Perfect for navigation and directional control.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    module: 'Joystick',
    requiredLevel: 'beginner',
    content: {
      overview: "The Joystick provides X and Y axis control, enabling 2D navigation and precise directional input.",
      sections: [
        {
          title: "Understanding 2D Input",
          text: "Unlike single-value sensors, the Joystick tracks two dimensions simultaneously: X-axis (left-right) and Y-axis (up-down). This creates a coordinate system for navigation and control."
        },
        {
          title: "Coordinate Systems",
          text: "The Joystick outputs values for both axes. Center position is typically (0,0) or (50,50) depending on normalization. Learning to work with 2D coordinates is fundamental for game development and UI navigation."
        },
        {
          title: "Practical Uses",
          text: "Joysticks excel at: Game controllers, robot navigation, drone control, menu navigation, cursor movement. Any application requiring directional control benefits from joystick input."
        }
      ],
      practiceActivity: "Control an LED's position on a grid using the joystick's X and Y values.",
      resources: [
        {
          title: "Joystick Module Documentation",
          url: "https://docs.ifmagic.io/modules/joystick"
        }
      ]
    }
  },
  // Intermediate Modules Start Here
  {
    id: 7,
    slug: 'distance-module-proximity-detection',
    title: "Distance Module - Proximity Detection",
    description: "Work with the Distance sensor to understand proximity detection and continuous data streams.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Distance',
    requiredLevel: 'intermediate',
    content: {
      overview: "Learn how to read continuous sensor data and use it to create interactive distance-based experiences.",
      sections: [
        {
          title: "How Distance Sensors Work",
          text: "The Distance module measures how far away objects are. It continuously outputs distance values in real-time, enabling touchless interaction and spatial awareness."
        },
        {
          title: "Threshold Logic",
          text: "You can create 'if-then' logic: IF distance < 10cm, THEN turn on light. This is the foundation of proximity detection used in automatic doors, parking sensors, and gesture controls."
        },
        {
          title: "Data Filtering",
          text: "Sensor data can be noisy. Learn techniques to smooth out readings and create more reliable interactions using averaging and thresholds."
        }
      ],
      practiceActivity: "Create a proximity alarm that beeps when something gets too close.",
      resources: [
        {
          title: "Distance Module Documentation",
          url: "https://docs.ifmagic.io/modules/distance"
        }
      ]
    }
  },
  {
    id: 8,
    slug: 'proximity-module-near-field-detection',
    title: "Proximity Module - Near Field Detection",
    description: "Detect nearby objects and hand gestures with the Proximity sensor. Create touchless interfaces.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Proximity',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Proximity module detects objects in close range, perfect for touchless interactions.",
      sections: [
        {
          title: "Proximity vs Distance",
          text: "While Distance modules measure exact distances, Proximity modules detect presence in near-field. Think of it like a motion detector - it knows something is there, rather than exactly how far away it is."
        },
        {
          title: "Touchless Interfaces",
          text: "Proximity sensors enable hands-free control. Wave to turn on lights, hover to activate menus, approach to wake devices. This is crucial for hygiene-conscious applications and accessibility."
        },
        {
          title: "Gesture Recognition Basics",
          text: "By detecting presence patterns over time, you can recognize simple gestures: wave, hover, approach, retreat. This forms the basis of gesture-based interfaces."
        }
      ],
      practiceActivity: "Create a touchless light switch that toggles when you wave your hand.",
      resources: [
        {
          title: "Proximity Module Documentation",
          url: "https://docs.ifmagic.io/modules/proximity"
        }
      ]
    }
  },
  {
    id: 9,
    slug: 'light-module-ambient-sensing',
    title: "Light Module - Ambient Sensing",
    description: "Measure light levels and create adaptive lighting systems with the Light sensor.",
    duration: "20 min",
    status: 'locked',
    category: 'sensor',
    module: 'Light',
    requiredLevel: 'beginner',
    content: {
      overview: "The Light module detects ambient brightness, enabling light-responsive applications.",
      sections: [
        {
          title: "How Light Sensors Work",
          text: "Light sensors (photoresistors or photodiodes) measure the intensity of ambient light. They output values that change based on brightness - high in sunlight, low in darkness."
        },
        {
          title: "Adaptive Systems",
          text: "Use light sensors to create adaptive systems: Auto-brightness displays, energy-saving lights that turn off in daylight, photography light meters, plant growth monitors."
        },
        {
          title: "Calibration Techniques",
          text: "Light sensors need calibration for different environments. Learn to normalize readings and set appropriate thresholds for 'bright', 'dim', and 'dark' conditions."
        }
      ],
      practiceActivity: "Build an auto-brightness system that adjusts LED intensity based on ambient light.",
      resources: [
        {
          title: "Light Module Documentation",
          url: "https://docs.ifmagic.io/modules/light"
        }
      ]
    }
  },
  {
    id: 10,
    slug: 'color-module-rgb-detection',
    title: "Color Module - RGB Detection",
    description: "Detect and analyze colors with the Color sensor. Learn about RGB values and color theory.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    module: 'Color',
    requiredLevel: 'intermediate', // Advanced color analysis requires intermediate
    content: {
      overview: "The Color module reads RGB values from objects, enabling color-based sorting and detection.",
      sections: [
        {
          title: "RGB Color Detection",
          text: "The Color sensor measures Red, Green, and Blue light reflected from objects. Every color can be described as a combination of these three values (0-255 each)."
        },
        {
          title: "Color Theory Basics",
          text: "Understanding RGB is fundamental to digital color: (255,0,0) is pure red, (0,255,0) is green, (0,0,255) is blue. Mix them for any color - (255,255,0) makes yellow!"
        },
        {
          title: "Practical Applications",
          text: "Color sensors enable: Product sorting by color, color-matching games, art projects, quality control in manufacturing, educational color theory demonstrations."
        }
      ],
      practiceActivity: "Create a color-matching game that lights up green when you show it a red object.",
      resources: [
        {
          title: "Color Module Documentation",
          url: "https://docs.ifmagic.io/modules/color"
        }
      ]
    }
  },

  {
    id: 11,
    slug: 'sound-module-audio-detection',
    title: "Sound Module - Audio Detection",
    description: "Detect sound levels and create sound-reactive systems with the Sound sensor.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Sound',
    requiredLevel: 'beginner',
    content: {
      overview: "The Sound module detects audio levels, enabling voice-activated and sound-reactive applications.",
      sections: [
        {
          title: "How Microphones Work",
          text: "The Sound module contains a microphone that measures sound pressure (volume/amplitude). It outputs values based on how loud the environment is."
        },
        {
          title: "Sound-Reactive Systems",
          text: "Create systems that respond to audio: Voice-activated lights, clap switches, music visualizers, noise monitors, security alarms triggered by sound."
        },
        {
          title: "Threshold Detection",
          text: "Set thresholds to detect specific sound levels: whisper, normal speech, shout, clap. This enables context-aware audio interactions."
        }
      ],
      practiceActivity: "Build a clap-activated light that turns on/off when you clap twice.",
      resources: [
        {
          title: "Sound Module Documentation",
          url: "https://docs.ifmagic.io/modules/sound"
        }
      ]
    }
  },
  {
    id: 12,
    slug: 'motion-module-movement-detection',
    title: "Motion Module - Movement Detection",
    description: "Detect motion and orientation changes with the Motion sensor and IMU.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    module: 'Motion',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Motion module uses an IMU (Inertial Measurement Unit) to detect movement, tilt, and orientation.",
      sections: [
        {
          title: "Understanding IMUs",
          text: "An IMU combines accelerometer and gyroscope to track: Acceleration (speeding up/slowing down), Orientation (which way it's facing), Rotation (spinning). This is the same tech in smartphones!"
        },
        {
          title: "Motion Patterns",
          text: "Detect specific movements: Shake, tilt, flip, rotate, sudden impact. Each creates a unique data signature you can recognize and respond to."
        },
        {
          title: "Applications",
          text: "Motion sensing enables: Step counters, fall detection, gesture controls, game controllers, orientation-based interfaces, vehicle movement tracking."
        }
      ],
      practiceActivity: "Create a shake-to-shuffle system that changes colors when you shake the device.",
      resources: [
        {
          title: "Motion Module Documentation",
          url: "https://docs.ifmagic.io/modules/motion"
        },
        {
          title: "Using the IMU",
          url: "https://docs.ifmagic.io/app/using-the-imu"
        }
      ]
    }
  },
  {
    id: 13,
    slug: 'gesture-module-advanced-motion-recognition',
    title: "Gesture Module - Advanced Motion Recognition",
    description: "Recognize complex gestures and create intuitive motion-based controls.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    module: 'Gesture',
    requiredLevel: 'advanced',
    content: {
      overview: "The Gesture module recognizes specific motion patterns for natural human-computer interaction.",
      sections: [
        {
          title: "Gesture Recognition",
          text: "Beyond simple motion detection, gesture recognition identifies specific patterns: swipe left, swipe right, circle, figure-8, wave. These feel natural and intuitive."
        },
        {
          title: "Machine Learning Basics",
          text: "Gesture recognition often uses machine learning to distinguish patterns. The system 'learns' what a swipe looks like vs a shake, making it smarter over time."
        },
        {
          title: "Natural Interfaces",
          text: "Gesture control creates magical experiences: Control music with hand waves, navigate menus with swipes, trigger actions with specific movements. No buttons needed!"
        }
      ],
      practiceActivity: "Program different gestures to control different colored lights.",
      resources: [
        {
          title: "Gesture Module Documentation",
          url: "https://docs.ifmagic.io/modules/gesture"
        }
      ]
    }
  },
  {
    id: 14,
    slug: 'flex-module-bend-sensing',
    title: "Flex Module - Bend Sensing",
    description: "Measure bending and flexing with the Flex sensor. Perfect for wearables and robotics.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Flex',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Flex module detects bending, enabling finger tracking, posture monitoring, and flexible interfaces.",
      sections: [
        {
          title: "How Flex Sensors Work",
          text: "Flex sensors change resistance when bent. The more you bend them, the more their value changes. This makes them perfect for detecting finger movements, joint angles, or material deformation."
        },
        {
          title: "Wearable Applications",
          text: "Flex sensors excel in wearables: VR glove controllers that track finger movements, posture monitors, rehabilitation devices, sports form analyzers, musical instrument controllers."
        },
        {
          title: "Calibration",
          text: "Each flex sensor has a different bend range. Learn to calibrate: measure straight position, measure fully bent, map the range to 0-100% for consistent behavior."
        }
      ],
      practiceActivity: "Create a finger-tracking system that changes LED brightness based on bend amount.",
      resources: [
        {
          title: "Flex Module Documentation",
          url: "https://docs.ifmagic.io/modules/flex"
        }
      ]
    }
  },
  {
    id: 15,
    slug: 'force-module-pressure-sensing',
    title: "Force Module - Pressure Sensing",
    description: "Measure pressure and force with the Force sensor. Create touch-sensitive interfaces.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Force',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Force module measures pressure, enabling force-sensitive controls and touch interfaces.",
      sections: [
        {
          title: "Pressure Sensing",
          text: "Force sensors (FSRs - Force Sensitive Resistors) detect how hard something is pressed. Light touch = low value, hard press = high value. This adds a dimension to touch interfaces."
        },
        {
          title: "Variable Sensitivity",
          text: "Unlike buttons (pressed/not pressed), force sensors provide graduated response. Light press for one action, hard press for another. This creates more expressive interfaces."
        },
        {
          title: "Applications",
          text: "Force sensing enables: Musical instruments with velocity sensitivity, weight scales, grip strength monitors, pressure-sensitive drawing tablets, smart floor tiles."
        }
      ],
      practiceActivity: "Create a drum pad where hitting harder produces brighter lights or louder sounds.",
      resources: [
        {
          title: "Force Module Documentation",
          url: "https://docs.ifmagic.io/modules/force"
        }
      ]
    }
  },
  {
    id: 16,
    slug: 'environment-module-temperature-humidity',
    title: "Environment Module - Temperature & Humidity",
    description: "Monitor environmental conditions with temperature and humidity sensors.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Environment',
    requiredLevel: 'advanced',
    content: {
      overview: "The Environment module measures temperature and humidity for climate monitoring and control.",
      sections: [
        {
          title: "Environmental Sensing",
          text: "The Environment module typically includes temperature and humidity sensors. These are crucial for climate control, comfort monitoring, and scientific experiments."
        },
        {
          title: "Understanding Units",
          text: "Temperature in Celsius or Fahrenheit, humidity as percentage (0-100%). Learning to work with these real-world units connects programming to physical phenomena."
        },
        {
          title: "Smart Home Applications",
          text: "Environmental data enables: Smart thermostats, plant care monitors, weather stations, greenhouse controllers, comfort indicators, energy optimization systems."
        }
      ],
      practiceActivity: "Create a comfort indicator that shows green (comfortable), yellow (borderline), or red (uncomfortable) based on temp/humidity.",
      resources: [
        {
          title: "Environment Module Documentation",
          url: "https://docs.ifmagic.io/modules/environment"
        }
      ]
    }
  },
  {
    id: 17,
    slug: 'thermal-module-temperature-detection',
    title: "Thermal Module - Temperature Detection",
    description: "Measure temperature and create temperature-responsive systems.",
    duration: "20 min",
    status: 'locked',
    category: 'sensor',
    module: 'Thermal',
    requiredLevel: 'advanced',
    content: {
      overview: "The Thermal module detects temperature, enabling heat-based detection and monitoring.",
      sections: [
        {
          title: "Temperature Sensing",
          text: "Thermal sensors measure temperature of objects or air. They're more focused than Environment modules, often used for spot temperature measurement."
        },
        {
          title: "Contactless Detection",
          text: "Some thermal sensors work contactlessly - they detect heat radiation (infrared) without touching. This enables presence detection and fever screening."
        },
        {
          title: "Applications",
          text: "Thermal sensing powers: Fever detection, hot surface warnings, engine temperature monitors, cooking temperature control, presence detection via body heat."
        }
      ],
      practiceActivity: "Build a hot surface alarm that alerts when temperature exceeds a safe threshold.",
      resources: [
        {
          title: "Thermal Module Documentation",
          url: "https://docs.ifmagic.io/modules/thermal"
        }
      ]
    }
  },
  {
    id: 18,
    slug: 'spin-module-continuous-rotation',
    title: "Spin Module - Continuous Rotation",
    description: "Track unlimited rotation with the Spin module. Perfect for wheels and continuous dials.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Spin',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Spin module tracks continuous 360° rotation without limits, unlike the bounded Dial module.",
      sections: [
        {
          title: "Spin vs Dial",
          text: "While the Dial has endpoints (40-330°), the Spin module rotates continuously - full 360° and beyond. Think of it like a wheel that keeps spinning."
        },
        {
          title: "Counting Rotations",
          text: "Spin modules can track not just angle but number of complete rotations. This enables: Odometers, winding mechanisms, endless encoders, scroll wheels."
        },
        {
          title: "Direction Detection",
          text: "Advanced spin modules detect clockwise vs counter-clockwise rotation, allowing bidirectional control."
        }
      ],
      practiceActivity: "Create a color wheel that cycles through all colors as you spin continuously.",
      resources: [
        {
          title: "Spin Module Documentation",
          url: "https://docs.ifmagic.io/modules/spin"
        }
      ]
    }
  },
  {
    id: 19,
    slug: 'move-module-accelerometer-basics',
    title: "Move Module - Accelerometer Basics",
    description: "Learn acceleration and movement tracking with the Move sensor.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    module: 'Move',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Move module detects acceleration and movement in 3D space.",
      sections: [
        {
          title: "Acceleration vs Position",
          text: "Accelerometers don't measure position - they measure acceleration (rate of speed change). When you move the sensor faster, it registers higher values. When still, it reads zero (except for gravity!)."
        },
        {
          title: "3-Axis Detection",
          text: "Movement happens in 3D: X (left-right), Y (forward-back), Z (up-down). By measuring all three axes, you can detect movement in any direction."
        },
        {
          title: "Practical Uses",
          text: "Accelerometers enable: Step counting (fitness trackers), impact detection (airbags), device orientation, shake detection, activity recognition (walking vs running)."
        }
      ],
      practiceActivity: "Create a step counter that increments each time you step.",
      resources: [
        {
          title: "Move Module Documentation",
          url: "https://docs.ifmagic.io/modules/move"
        }
      ]
    }
  },
  {
    id: 20,
    slug: 'digital-module-binary-io',
    title: "Digital Module - Binary I/O",
    description: "Understand digital signals and binary input/output with the Digital module.",
    duration: "20 min",
    status: 'locked',
    category: 'sensor',
    module: 'Digital',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Digital module handles basic binary signals - the foundation of all digital electronics.",
      sections: [
        {
          title: "Digital Signals",
          text: "Digital means two states: HIGH (1, ON, ~5V) or LOW (0, OFF, 0V). All digital electronics work with these two states - it's the language of computers!"
        },
        {
          title: "Input vs Output",
          text: "Digital pins can be INPUT (reading signals from sensors) or OUTPUT (sending signals to devices). Understanding this direction is crucial for electronics."
        },
        {
          title: "Logic Levels",
          text: "Learn about voltage levels, pull-up/pull-down resistors, and how digital signals travel between components. This knowledge applies to all embedded systems."
        }
      ],
      practiceActivity: "Create a simple digital input/output system that echoes button presses to an LED.",
      resources: [
        {
          title: "Digital Module Documentation",
          url: "https://docs.ifmagic.io/modules/digital"
        }
      ]
    }
  },

  // OUTPUT LESSONS - Beginner friendly
  {
    id: 21,
    slug: 'glow-module-controlling-leds',
    title: "Glow Module - Controlling LEDs",
    description: "Learn to control LED outputs, set colors, and adjust brightness using the Glow module.",
    duration: "20 min",
    status: 'locked',
    category: 'output',
    module: 'Glow',
    requiredLevel: 'beginner',
    content: {
      overview: "The Glow module lets you control RGB LEDs - set colors and brightness to create visual feedback.",
      sections: [
        {
          title: "RGB Color System",
          text: "Colors are created by mixing Red, Green, and Blue (RGB). Each color has a value from 0-255. Red (255,0,0), Green (0,255,0), Blue (0,0,255). Mix them to create any color!"
        },
        {
          title: "Brightness Control",
          text: "Beyond color, you can control brightness (intensity). This is often done with PWM (Pulse Width Modulation) - rapidly turning the LED on/off to simulate dimming."
        },
        {
          title: "Visual Feedback",
          text: "LEDs are perfect for user feedback: Green = success, Red = error, Blue = processing. Learn to use color psychology in your embedded projects."
        }
      ],
      practiceActivity: "Create a color-changing light that responds to button presses.",
      resources: [
        {
          title: "Glow Module Documentation",
          url: "https://docs.ifmagic.io/modules/glow"
        }
      ]
    }
  },
  {
    id: 22,
    slug: 'tone-module-musical-output',
    title: "Tone Module - Musical Output",
    description: "Generate musical tones and melodies using the Tone module.",
    duration: "25 min",
    status: 'locked',
    category: 'output',
    module: 'Tone',
    requiredLevel: 'beginner',
    content: {
      overview: "Create audio experiences - from simple beeps to musical notes and melodies.",
      sections: [
        {
          title: "How Digital Sound Works",
          text: "The Tone module generates specific frequencies (measured in Hertz). Different frequencies create different pitches. Middle C = 262 Hz, A4 = 440 Hz, higher Hz = higher pitch."
        },
        {
          title: "Musical Theory Basics",
          text: "Learn the relationship between frequency and musical notes. Each note corresponds to a specific frequency. Doubling frequency raises the note by one octave."
        },
        {
          title: "Creating Melodies",
          text: "Combine frequencies and durations to create melodies. Sequence notes to play songs. Add rhythm with timing control. This is how digital music works!"
        },
        {
          title: "Audio Feedback Design",
          text: "Sound is powerful feedback: Click sounds for button presses, rising tones for success, beeps for warnings. Learn to design intuitive audio interfaces."
        }
      ],
      practiceActivity: "Create a musical keyboard using multiple Button modules, each playing a different note.",
      resources: [
        {
          title: "Tone Module Documentation",
          url: "https://docs.ifmagic.io/modules/tone"
        }
      ]
    }
  },

  // ADVANCED LESSONS - Require higher skill levels
  {
    id: 23,
    slug: 'creating-equations-logic-flow',
    title: "Creating Equations - Logic Flow",
    description: "Master IF MAGIC's equation system to create complex interactions between multiple modules.",
    duration: "30 min",
    status: 'locked',
    category: 'advanced',
    requiredLevel: 'intermediate',
    content: {
      overview: "Equations are the brain of IF MAGIC - learn to connect inputs to outputs with logic.",
      sections: [
        {
          title: "What are Equations?",
          text: "Equations in IF MAGIC are visual logic flows: Input → Process → Output. Think of them like recipes: IF button pressed, THEN light turns on. They replace traditional coding with intuitive connections."
        },
        {
          title: "Equation Components",
          text: "Inputs: Data from sensor modules. Processing: Math, logic, conditions. Outputs: Commands to output modules. Sequences: Time-based actions. You combine these to create behaviors."
        },
        {
          title: "Building Complex Logic",
          text: "Start simple, then combine: Multiple inputs (AND/OR logic), Conditional triggers (IF-THEN), Value transformations (mapping ranges), Sequential actions (do A, then B, then C)."
        }
      ],
      practiceActivity: "Create an equation that uses 3 different modules working together.",
      resources: [
        {
          title: "Getting Started with Equations",
          url: "https://docs.ifmagic.io/equations/getting-started"
        },
        {
          title: "Equation Logic",
          url: "https://docs.ifmagic.io/equations/equation-logic"
        }
      ]
    }
  },
  {
    id: 24,
    slug: 'multi-module-interactions',
    title: "Multi-Module Interactions",
    description: "Combine multiple sensor and output modules to create complex, responsive systems.",
    duration: "35 min",
    status: 'locked',
    category: 'advanced',
    requiredLevel: 'intermediate',
    content: {
      overview: "Learn to orchestrate multiple modules working together for sophisticated interactions.",
      sections: [
        {
          title: "System Thinking",
          text: "Real projects use multiple modules: Sensors for input, outputs for feedback, logic to connect them. Learn to think in systems - how components work together to create experiences."
        },
        {
          title: "Data Flow Design",
          text: "Map out how data flows: Sensor → Processing → Output. Multiple sensors can feed one output, or one sensor can control multiple outputs. Design the flow before coding!"
        },
        {
          title: "Complex Behaviors",
          text: "Create sophisticated behaviors: Light changes color based on temperature AND proximity, sound pitch follows distance sensor, multiple buttons control different aspects of one LED."
        }
      ],
      practiceActivity: "Build a system using at least 3 different modules that interact with each other.",
      resources: [
        {
          title: "Equation Logic",
          url: "https://docs.ifmagic.io/equations/equation-logic"
        }
      ]
    }
  },
  {
    id: 25,
    slug: 'advanced-motion-gesture-control',
    title: "Advanced Motion & Gesture Control",
    description: "Create sophisticated gesture-based interactions using Motion and Gesture modules.",
    duration: "30 min",
    status: 'locked',
    category: 'advanced',
    requiredLevel: 'advanced',
    content: {
      overview: "Learn to detect movement, tilting, and gestures using the built-in IMU (Inertial Measurement Unit).",
      sections: [
        {
          title: "Understanding IMU",
          text: "The IMU (Inertial Measurement Unit) detects orientation, acceleration, and rotation. It's the same technology in smartphones that rotates your screen!"
        },
        {
          title: "Gesture Recognition",
          text: "Detect patterns of movement: Shake, Tilt, Rotate, Flip. These can trigger actions - shake to shuffle, tilt to scroll, rotate to adjust settings."
        },
        {
          title: "Motion-Based Interfaces",
          text: "Motion control creates intuitive, hands-free interfaces. Used in gaming, VR, accessibility devices, and modern IoT products."
        }
      ],
      practiceActivity: "Create a tilt-controlled light that changes color based on orientation.",
      resources: [
        {
          title: "Motion Module Documentation",
          url: "https://docs.ifmagic.io/modules/motion"
        },
        {
          title: "Using the IMU",
          url: "https://docs.ifmagic.io/app/using-the-imu"
        },
        {
          title: "Gesture Module",
          url: "https://docs.ifmagic.io/modules/gesture"
        }
      ]
    }
  },
  {
    id: 26,
    slug: 'using-the-api-code-integration',
    title: "Using the API - Code Integration",
    description: "Learn to control IF MAGIC hardware programmatically using JavaScript, Python, or Unity.",
    duration: "40 min",
    status: 'locked',
    category: 'advanced',
    requiredLevel: 'advanced',
    content: {
      overview: "Move beyond the app - control your hardware with code using the IF MAGIC API.",
      sections: [
        {
          title: "What is an API?",
          text: "API (Application Programming Interface) lets your code talk to IF MAGIC. Instead of using the app's visual interface, you write code to read sensors and control outputs."
        },
        {
          title: "Language Support",
          text: "IF MAGIC supports multiple languages: JavaScript for web apps, Python for data science, Unity for games. Choose the language that fits your project!"
        },
        {
          title: "Reading Sensor Data",
          text: "Use API calls to get real-time sensor data in your code. Example: var button = Magic.modules.button.pressed; This opens up endless possibilities!"
        },
        {
          title: "Controlling Outputs",
          text: "Send commands to output modules from code. Set LED colors, play tones, all programmatically. Combine with web apps, games, or data visualizations."
        }
      ],
      practiceActivity: "Write a simple JavaScript program that reads a sensor and controls an output.",
      resources: [
        {
          title: "API Documentation",
          url: "https://docs.ifmagic.io/api"
        },
        {
          title: "JavaScript API",
          url: "https://docs.ifmagic.io/api/languages"
        }
      ]
    }
  },
  {
    id: 27,
    slug: 'final-project-build-your-creation',
    title: "Final Project - Build Your Creation",
    description: "Apply everything you've learned to build a complete interactive project from scratch.",
    duration: "60 min",
    status: 'locked',
    category: 'advanced',
    requiredLevel: 'advanced',
    content: {
      overview: "Time to create! Use multiple modules, equations, and everything you've learned to build something unique.",
      sections: [
        {
          title: "Project Ideas",
          text: "Interactive Lighting: Control room lights with gestures. Music Remote: Create a wireless controller. Smart Drawer: Get notifications when someone opens it. The possibilities are endless!"
        },
        {
          title: "Design Process",
          text: "1. Define your goal. 2. Choose your modules. 3. Sketch the logic flow. 4. Build equations step-by-step. 5. Test and iterate. 6. Polish and share!"
        },
        {
          title: "Debugging Tips",
          text: "Test one module at a time. Use streaming to see live data. Break complex equations into smaller ones. Check module connections. Read the documentation!"
        }
      ],
      practiceActivity: "Build a complete project using at least 3 modules and share it!",
      resources: [
        {
          title: "Project Templates",
          url: "https://docs.ifmagic.io/projects"
        },
        {
          title: "Touch-Free Music Remote",
          url: "https://docs.ifmagic.io/projects/touch-free-music-remote"
        },
        {
          title: "Interactive Lighting",
          url: "https://docs.ifmagic.io/projects/interactive-lighting"
        }
      ]
    }
  }
];

/**
 * Helper function to get a lesson by ID
 * This demonstrates "data access patterns" - how we retrieve specific data
 */
export const getLessonById = (id: number): Lesson | undefined => {
  return lessons.find(lesson => lesson.id === id);
};

/**
 * Helper function to get a lesson by slug
 * Used for URL-based lesson lookup
 */
export const getLessonBySlug = (slug: string): Lesson | undefined => {
  return lessons.find(lesson => lesson.slug === slug);
};

/**
 * Helper function to get lessons by category
 * Useful for organizing lessons by topic
 */
export const getLessonsByCategory = (category: Lesson['category']): Lesson[] => {
  return lessons.filter(lesson => lesson.category === category);
};

/**
 * Helper function to get lessons by module
 * Find all lessons related to a specific IF MAGIC module
 */
export const getLessonsByModule = (moduleName: string): Lesson[] => {
  return lessons.filter(lesson => lesson.module === moduleName);
};

/**
 * ACCESS CONTROL HELPERS
 * These functions determine what content users can access based on their skill level
 */

/**
 * Check if user can access a lesson based on their level
 * Access hierarchy:
 * - Beginner: Can only access Beginner lessons
 * - Intermediate: Can access Beginner AND Intermediate lessons
 * - Advanced: Can access ALL lessons (Beginner, Intermediate, Advanced)
 * 
 * NOTE: Handles case-insensitive comparison
 */
export const canAccessLesson = (userLevel: UserLevel, lesson: Lesson): boolean => {
  const levelHierarchy: Record<string, number> = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3
  };
  
  // Normalize to lowercase for comparison
  const normalizedUserLevel = userLevel.toLowerCase();
  const normalizedLessonLevel = lesson.requiredLevel.toLowerCase();
  
  return (levelHierarchy[normalizedUserLevel] || 0) >= (levelHierarchy[normalizedLessonLevel] || 0);
};

/**
 * Filter lessons based on user's access level
 * Returns only lessons the user is allowed to see
 */
export const getAccessibleLessons = (userLevel: UserLevel): Lesson[] => {
  return lessons.filter(lesson => canAccessLesson(userLevel, lesson));
};

/**
 * Get user from localStorage
 * Returns user object if logged in, null otherwise
 */
export const getCurrentUser = (): { name: string; email: string; level: UserLevel } | null => {
  const userStr = localStorage.getItem('hardwareHubUser');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

/**
 * LESSON PROGRESS TRACKING (localStorage-based)
 * These functions track which lessons a user has completed
 */

/**
 * Get completed lesson IDs for current user
 */
export const getCompletedLessons = (): number[] => {
  const user = getCurrentUser();
  if (!user) return [];
  
  const key = `completedLessons_${user.email}`;
  const completed = localStorage.getItem(key);
  return completed ? JSON.parse(completed) : [];
};

/**
 * Mark a lesson as completed
 */
export const markLessonComplete = (lessonId: number): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `completedLessons_${user.email}`;
  const completed = getCompletedLessons();
  
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(key, JSON.stringify(completed));
  }
};

/**
 * Check if a specific lesson is completed
 */
export const isLessonCompleted = (lessonId: number): boolean => {
  return getCompletedLessons().includes(lessonId);
};
