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
  requiredLevel: UserLevel; // Minimum user level required
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
    path: 'ifmagic',
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
    description: "A digital input module that detects whether a physical button is pressed or not. Learn about switch bouncing and debouncing.",
    duration: "20 min",
    status: 'available',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Button',
    requiredLevel: 'beginner',
    content: {
      overview: "The Button module is a digital input that detects whether a physical button is pressed or not. Range consists of 0 or 1. This module can be connected to any digital port and is commonly used to trigger events or control program flow.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that detects whether a physical button is pressed or not. Range consists of 0 or 1. 1 (true) corresponds to the button pressed, while 0 (false) corresponds to the button not pressed. This module can be connected to any digital port and is commonly used to trigger events or control program flow."
        },
        {
          title: "Physical Button Design",
          text: "The most common type of button is a pushbutton, which typically comes in a 4-pin packaging. This 4-pin design allows signals to pass through when the button is pressed (or not) depending on how it is wired. Usually, pushbuttons are wired in a cross pattern where the top left pin's output corresponds to either of the right pins."
        },
        {
          title: "Understanding Switch Bouncing",
          text: "Since buttons are cheap and mass-produced, they suffer from a phenomenon called 'switch bouncing'. This is when after an intended press and release, the button generates quick and slight pulses. Libraries can handle button debouncing, but often it's up to the designer to implement a form of de-bouncing in their code."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the button state using the Magic API:",
          codeExample: "var buttonState = Magic.modules.button.state;\n// Returns 0 (not pressed) or 1 (pressed)\n\n// Example: Toggle LED on button press\nif (buttonState === 1) {\n  Magic.modules.glow.setColor('#00FF00');\n}"
        },
        {
          title: "Common Uses",
          text: "Buttons are commonly used to: Trigger events when pressed, Control program flow (start/stop), Toggle states on and off, Create interactive user controls, and implement menu navigation systems."
        }
      ],
      practiceActivity: "Connect a Button module and create an equation that changes a Glow module color when pressed.",
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
    description: "Explore analog sensors with the Slider module. Learn about potentiometers, variable input and value mapping.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Slider',
    requiredLevel: 'beginner',
    content: {
      overview: "The Slider is an analog input module that reads the position of a physical slider. Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for controlling values that need smooth adjustment.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the position of a physical slider. Range consists of 0-100 (0-4095 raw). 0 corresponds to the slider being in the lowest position, while 100 corresponds to the slider being in the highest position. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding Potentiometers",
          text: "A slider, rotary dial, and joystick operate very similarly. They all use some form of a potentiometer. A potentiometer is a type of variable resistor, which is a device that changes its resistance as it is manipulated. There are different types of potentiometers, but the key concept is that moving the slider changes the resistance, which changes the voltage output read by the microcontroller."
        },
        {
          title: "Analog vs Digital",
          text: "Unlike buttons (which are digital - just ON/OFF), sliders output a continuous range of values from 0-100. As you move the slider, the value changes smoothly. The raw sensor value is 0-4095 (12-bit ADC), but IF MAGIC normalizes this to 0-100 for easier use."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Slider module only works on analog-capable ports: 1, 2, 7, and 8. Digital-only ports cannot read the variable resistance values that the slider produces."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the slider position using the Magic API:",
          codeExample: "var position = Magic.modules.slider.position;\n// Returns 0-100 based on slider position\n\n// Example: Map slider to LED brightness\nMagic.modules.glow.setBrightness(position);\n\n// Raw value access (0-4095)\nvar rawPosition = Magic.modules.slider.rawPosition;"
        },
        {
          title: "Common Uses",
          text: "Sliders are commonly used to: Control volume levels, Adjust brightness settings, Set speed values, Create smooth transitions, and implement user preference controls."
        }
      ],
      practiceActivity: "Use the Slider to control the brightness of a Glow module. Try mapping the 0-100 range to different color intensities.",
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
    description: "Master rotational input with the Dial module. Learn about potentiometers, angular position, and intuitive knob controls.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Dial',
    requiredLevel: 'beginner',
    content: {
      overview: "The Dial is an analog input module that reads the rotational position of a physical dial/knob. Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for precise rotational controls.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the rotational position of a physical dial. Range consists of 0-100 (0-4095 raw). 0 corresponds to the dial being in the leftmost position, while 100 corresponds to the dial being in the rightmost position. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding Potentiometers",
          text: "A slider, rotary dial, and joystick operate very similarly. They all use some form of a potentiometer. A potentiometer is a type of variable resistor, which is a device that changes its resistance as it is manipulated. The dial uses a rotary potentiometer - as you turn the knob, the resistance changes, which changes the voltage output."
        },
        {
          title: "Angular Range",
          text: "The Dial module rotates between approximately 40° (leftmost, value 0) and 330° (rightmost, value 100). Unlike the Spin module, the Dial doesn't rotate a full 360° - it has defined endpoints, just like a volume knob on a stereo."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Dial module only works on analog-capable ports: 1, 2, 7, and 8. These ports have ADC (Analog-to-Digital Converter) capability needed to read the variable resistance."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the dial position using the Magic API:",
          codeExample: "var position = Magic.modules.dial.position;\n// Returns 0-100 based on dial rotation\n\n// Convert to degrees (approximate)\nvar degrees = 40 + (position / 100) * 290;\n// Returns ~40-330 degrees\n\n// Raw value access (0-4095)\nvar rawPosition = Magic.modules.dial.rawPosition;"
        },
        {
          title: "Common Uses",
          text: "Dials are commonly used for: Volume controls, Brightness adjustments, Temperature settings, Menu navigation, Timer settings, and any interface needing smooth rotational input."
        }
      ],
      practiceActivity: "Create a color picker that changes hue as you rotate the dial. Map 0-100 to 0-360 degrees of hue.",
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
    path: 'ifmagic',
    module: 'Joystick',
    requiredLevel: 'beginner',
    content: {
      overview: "The Joystick is an analog input module that reads the X and Y positions of a physical joystick. Each axis range consists of 0-100 (0-4095 raw). This module requires TWO analog ports (1, 2, 7, 8) and is commonly used for 2D navigation and directional control.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the X and Y positions of a physical joystick. Each axis range consists of 0-100 (0-4095 raw). 0 corresponds to the joystick being in the leftmost/lowest position for that axis, while 100 corresponds to the joystick being in the rightmost/highest position."
        },
        {
          title: "Two Potentiometers in One",
          text: "A joystick is essentially two potentiometers combined into one package - one for the X-axis (left-right) and one for the Y-axis (up-down). As you move the joystick, both potentiometers change their resistance independently, giving you true 2D control."
        },
        {
          title: "Port Requirements",
          text: "IMPORTANT: Since the joystick reads two analog values, it requires TWO analog-capable ports. Only ports 1, 2, 7, and 8 support analog input. You'll typically connect X to one port and Y to another."
        },
        {
          title: "Center Position",
          text: "At rest, the joystick centers at approximately (50, 50). Values less than 50 indicate left/down movement, while values greater than 50 indicate right/up movement. Some joysticks may need calibration to find the exact center."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the joystick positions using the Magic API:",
          codeExample: "var xPosition = Magic.modules.joystick.x;\nvar yPosition = Magic.modules.joystick.y;\n// Both return 0-100\n\n// Example: Detect direction\nif (xPosition < 30) {\n  console.log('Moving Left');\n} else if (xPosition > 70) {\n  console.log('Moving Right');\n}\n\n// Raw values (0-4095)\nvar rawX = Magic.modules.joystick.rawX;\nvar rawY = Magic.modules.joystick.rawY;"
        },
        {
          title: "Common Uses",
          text: "Joysticks are commonly used for: Game controllers, Robot navigation, Drone control, Menu navigation, Cursor movement, Camera gimbal control, and any 2D directional input."
        }
      ],
      practiceActivity: "Control an LED's color using the joystick - X axis controls hue, Y axis controls brightness.",
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
    path: 'ifmagic',
    module: 'Distance',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Distance module is an analog input that measures the distance to an object using ultrasonic or infrared technology. Range consists of 0-100 (scaled from raw distance values). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for proximity detection and spatial awareness.",
      sections: [
        {
          title: "How It Works",
          text: "A distance sensor measures how far away an object is. Ultrasonic sensors send out sound waves and time how long they take to bounce back. Infrared sensors use light reflection. The module outputs 0-100 where lower values mean closer objects."
        },
        {
          title: "Ultrasonic vs Infrared",
          text: "Ultrasonic sensors use sound waves (like a bat) and work well for larger distances (up to several meters). Infrared sensors use light and work better for shorter distances. Both have blind spots at very close range."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Distance module only works on analog-capable ports: 1, 2, 7, and 8. The sensor outputs varying voltage levels based on distance."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the distance value using the Magic API:",
          codeExample: "var distance = Magic.modules.distance.value;\n// Returns 0-100 (close to far)\n\n// Example: Proximity alarm\nif (distance < 20) {\n  console.log('Object very close!');\n  Magic.modules.glow.setColor('#FF0000'); // Red warning\n}\n\n// Get distance in cm (if supported)\nvar distanceCm = Magic.modules.distance.cm;"
        },
        {
          title: "Common Uses",
          text: "Distance sensors are commonly used for: Parking sensors, Automatic doors, Robot obstacle avoidance, Gesture detection, Security systems, Level measurement (tanks/containers), and touchless interfaces."
        }
      ],
      practiceActivity: "Create a proximity alarm that changes Glow color based on how close objects are - far=green, medium=yellow, close=red.",
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
    description: "Detect nearby objects and gestures with IR sensors. Create touchless, hands-free interfaces.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Proximity',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Proximity module is a digital input that detects the presence of nearby objects using infrared (IR) reflection. Range consists of 0-255 (closer = higher value). This module can be connected to any digital port and is commonly used for touchless interfaces.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that detects the presence of nearby objects using infrared (IR) light. The sensor emits IR light and measures how much bounces back. More light reflected = object is closer. Range is 0-255 where higher values indicate closer objects."
        },
        {
          title: "Proximity vs Distance",
          text: "While Distance modules measure exact distances in cm, Proximity modules detect relative closeness. Think of it as 'how close is something?' rather than 'exactly how many centimeters away is it?' This makes it faster and more responsive for gesture detection."
        },
        {
          title: "Port Compatibility",
          text: "The Proximity module uses digital communication (I2C) and can be connected to any digital port (1-8)."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the proximity value using the Magic API:",
          codeExample: "var proximity = Magic.modules.proximity.value;\n// Returns 0-255 (far to close)\n\n// Example: Touchless light switch\nif (proximity > 200) {\n  toggleLight(); // Very close - activate!\n}\n\n// Detect hand hover\nif (proximity > 100 && proximity < 180) {\n  console.log('Hand hovering nearby');\n}"
        },
        {
          title: "Common Uses",
          text: "Proximity sensors are commonly used for: Touchless light switches, Hand gesture detection, Hover effects, Automatic faucets, Phone face detection, and hands-free hygiene-conscious controls."
        }
      ],
      practiceActivity: "Create a touchless light switch that toggles when you wave your hand close to the sensor.",
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
    description: "Measure light levels with photoresistors and create adaptive lighting systems.",
    duration: "20 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Light',
    requiredLevel: 'beginner',
    content: {
      overview: "The Light module is an analog input that reads the ambient light level. Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for light-responsive applications.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the ambient light level using a photoresistor. Range consists of 0-100 (0-4095 raw). 0 corresponds to complete darkness, while 100 corresponds to bright light. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding Photoresistors",
          text: "A photoresistor (also called LDR - Light Dependent Resistor) is a component whose resistance changes based on the amount of light hitting it. In bright light, resistance is low; in darkness, resistance is high. The microcontroller reads this changing resistance as a voltage value."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Light module only works on analog-capable ports: 1, 2, 7, and 8. These ports can read the variable resistance that changes with light levels."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the light level using the Magic API:",
          codeExample: "var lightLevel = Magic.modules.light.level;\n// Returns 0-100 (dark to bright)\n\n// Example: Auto-brightness\nif (lightLevel < 30) {\n  Magic.modules.glow.setBrightness(100); // Full brightness in dark\n} else {\n  Magic.modules.glow.setBrightness(50);  // Dim in bright room\n}\n\n// Raw value access (0-4095)\nvar rawLight = Magic.modules.light.rawLevel;"
        },
        {
          title: "Common Uses",
          text: "Light sensors are commonly used for: Auto-brightness displays, Energy-saving smart lights, Day/night detection, Photography light meters, Plant growth monitors, and security systems."
        }
      ],
      practiceActivity: "Build an auto-brightness system that adjusts Glow module intensity based on ambient light level.",
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
    description: "Detect and analyze colors with RGB sensors. Learn about color theory, ambient light compensation, and color matching.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Color',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Color module is a digital input that reads the RGB color values of an object placed in front of it. Returns values for Red, Green, and Blue channels (0-255 each). This module can be connected to any digital port and is commonly used for color detection and sorting.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that reads the RGB color values of an object placed in front of it. It uses LEDs to illuminate the object and photodiodes to measure the reflected light for each color channel. Returns separate values for Red, Green, and Blue (0-255 each)."
        },
        {
          title: "RGB Color Theory",
          text: "Every color can be represented as a combination of Red, Green, and Blue. Pure red is (255,0,0), pure green is (0,255,0), pure blue is (0,0,255). Yellow is (255,255,0), cyan is (0,255,255), magenta is (255,0,255), white is (255,255,255), and black is (0,0,0)."
        },
        {
          title: "Ambient Light Considerations",
          text: "Color sensors work best in controlled lighting conditions. Ambient light from the room can affect readings. Many color sensors include a built-in LED to provide consistent illumination, and you should keep the sensor close to the object being measured."
        },
        {
          title: "Port Compatibility",
          text: "The Color module uses digital communication (I2C) and can be connected to any digital port (1-8)."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the color values using the Magic API:",
          codeExample: "var red = Magic.modules.color.red;     // 0-255\nvar green = Magic.modules.color.green; // 0-255\nvar blue = Magic.modules.color.blue;   // 0-255\n\n// Detect if object is mostly red\nif (red > 200 && green < 100 && blue < 100) {\n  console.log('Red object detected!');\n}\n\n// Get hex color string\nvar hexColor = Magic.modules.color.hex;\n// Returns '#RRGGBB' format"
        },
        {
          title: "Common Uses",
          text: "Color sensors are commonly used for: Product sorting by color, Color-matching games, Art and design projects, Quality control in manufacturing, Line-following robots, and educational color theory."
        }
      ],
      practiceActivity: "Create a color-matching game: show the sensor different colored objects and have the Glow module match the color.",
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
    description: "Detect sound levels with microphones and create sound-reactive, voice-activated systems.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Sound',
    requiredLevel: 'beginner',
    content: {
      overview: "The Sound module is an analog input that reads the volume level of ambient sound. Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for sound-reactive applications.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the volume level of ambient sound using a microphone. Range consists of 0-100 (0-4095 raw). 0 corresponds to silence, while 100 corresponds to very loud sound. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding Microphones",
          text: "The Sound module contains a small electret microphone that converts sound waves (pressure variations in air) into electrical signals. Louder sounds create larger electrical signals, which are read by the ADC (Analog-to-Digital Converter) as higher values."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Sound module only works on analog-capable ports: 1, 2, 7, and 8. These ports can read the varying voltage levels from the microphone."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the sound level using the Magic API:",
          codeExample: "var soundLevel = Magic.modules.sound.level;\n// Returns 0-100 (quiet to loud)\n\n// Example: Clap detection\nif (soundLevel > 80) {\n  console.log('Loud sound detected!');\n  Magic.modules.glow.setColor('#FF0000');\n}\n\n// Raw value access (0-4095)\nvar rawSound = Magic.modules.sound.rawLevel;"
        },
        {
          title: "Common Uses",
          text: "Sound sensors are commonly used for: Voice-activated lights, Clap switches, Music visualizers, Noise level monitors, Security alarms, and interactive sound games."
        }
      ],
      practiceActivity: "Build a clap-activated light that toggles on/off when you clap loudly.",
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
    description: "Detect motion with IMU (accelerometer + gyroscope). Track tilt, shake, orientation, and movement patterns.",
    duration: "30 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Motion',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Motion module is a digital input that detects movement and orientation using an IMU (Inertial Measurement Unit). It provides acceleration (X, Y, Z), rotation rates, and tilt angles. This module can be connected to any digital port and is commonly used for gesture detection and orientation tracking.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that detects movement and orientation using an IMU (Inertial Measurement Unit). The IMU combines an accelerometer (measures acceleration/tilt) and a gyroscope (measures rotation rate). This is the same technology in your smartphone!"
        },
        {
          title: "Accelerometer",
          text: "The accelerometer measures acceleration in three axes: X (left/right), Y (forward/backward), Z (up/down). When stationary, it also measures gravity, allowing you to detect tilt. Values typically range from -100 to 100 for each axis."
        },
        {
          title: "Gyroscope",
          text: "The gyroscope measures how fast the device is rotating around each axis: Roll (rotating around X), Pitch (rotating around Y), Yaw (rotating around Z). This helps detect spinning, turning, and rotational gestures."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the motion sensor using the Magic API:",
          codeExample: "// Acceleration (includes gravity)\nvar accelX = Magic.modules.motion.x;\nvar accelY = Magic.modules.motion.y;\nvar accelZ = Magic.modules.motion.z;\n\n// Detect shake\nif (Math.abs(accelX) > 80 || Math.abs(accelY) > 80) {\n  console.log('Shake detected!');\n}\n\n// Rotation rates\nvar roll = Magic.modules.motion.roll;\nvar pitch = Magic.modules.motion.pitch;\nvar yaw = Magic.modules.motion.yaw;"
        },
        {
          title: "Common Uses",
          text: "Motion sensors are commonly used for: Step counters, Fall detection, Shake gestures, Tilt controls (like a steering wheel), Game controllers, Screen orientation, Anti-theft devices, and vehicle movement tracking."
        }
      ],
      practiceActivity: "Create a shake-to-shuffle system that changes Glow color randomly when you shake the device.",
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
    path: 'ifmagic',
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
    description: "Measure bending with variable resistors. Perfect for wearables, VR gloves, and robotics.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Flex',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Flex module is an analog input that reads the bend amount of a flex sensor. Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for wearables and detecting physical deformation.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the bend amount of a flex sensor. Range consists of 0-100 (0-4095 raw). 0 corresponds to the sensor being flat/unbent, while 100 corresponds to the sensor being fully bent. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding Flex Sensors",
          text: "Flex sensors are variable resistors that change their resistance based on how much they are bent. They contain a carbon-based conductive ink on a flexible substrate. When bent, the ink particles spread apart, increasing resistance. The microcontroller reads this changing resistance as a voltage value."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Flex module only works on analog-capable ports: 1, 2, 7, and 8. These ports can read the variable resistance that changes as the sensor bends."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the flex sensor value using the Magic API:",
          codeExample: "var bendAmount = Magic.modules.flex.bend;\n// Returns 0-100 (flat to fully bent)\n\n// Example: Finger tracking for VR glove\nif (bendAmount > 70) {\n  console.log('Finger is bent');\n} else if (bendAmount < 30) {\n  console.log('Finger is straight');\n}\n\n// Raw value access (0-4095)\nvar rawBend = Magic.modules.flex.rawBend;"
        },
        {
          title: "Common Uses",
          text: "Flex sensors are commonly used for: VR glove controllers, Finger tracking, Posture monitors, Rehabilitation devices, Sports form analyzers, Musical instrument controllers, and robot joint sensing."
        }
      ],
      practiceActivity: "Create a finger-tracking system that changes Glow brightness based on bend amount - flat = dim, bent = bright.",
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
    description: "Measure pressure with FSRs (Force Sensitive Resistors). Create touch-sensitive, pressure-aware interfaces.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Force',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Force module is an analog input that reads the pressure applied to a force-sensitive resistor (FSR). Range consists of 0-100 (0-4095 raw). This module only works on analog-capable ports (1, 2, 7, 8) and is commonly used for pressure-sensitive controls.",
      sections: [
        {
          title: "How It Works",
          text: "An analog input module that reads the pressure applied to a force-sensitive resistor. Range consists of 0-100 (0-4095 raw). 0 corresponds to no pressure applied, while 100 corresponds to maximum pressure. This module only works on analog-capable ports (1, 2, 7, 8)."
        },
        {
          title: "Understanding FSRs",
          text: "FSRs (Force Sensitive Resistors) contain conductive particles between two flexible membranes. When you press on the sensor, the particles are pushed together, reducing resistance. Harder press = lower resistance = higher voltage reading. This gives you graduated pressure sensing, not just ON/OFF."
        },
        {
          title: "Port Compatibility",
          text: "IMPORTANT: The Force module only works on analog-capable ports: 1, 2, 7, and 8. These ports can read the variable resistance that changes with applied pressure."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the force sensor value using the Magic API:",
          codeExample: "var pressure = Magic.modules.force.pressure;\n// Returns 0-100 (no pressure to max pressure)\n\n// Example: Velocity-sensitive drum\nif (pressure > 80) {\n  playSound('loud_drum.mp3');\n} else if (pressure > 40) {\n  playSound('medium_drum.mp3');\n} else if (pressure > 10) {\n  playSound('soft_drum.mp3');\n}\n\n// Raw value access (0-4095)\nvar rawPressure = Magic.modules.force.rawPressure;"
        },
        {
          title: "Common Uses",
          text: "Force sensors are commonly used for: Velocity-sensitive musical instruments, Pressure-sensitive drawing tablets, Weight scales, Grip strength monitors, Smart floor tiles, Squeeze toys, and variable-pressure buttons."
        }
      ],
      practiceActivity: "Create a velocity-sensitive drum pad where hitting harder produces brighter Glow colors.",
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
    path: 'ifmagic',
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
    path: 'ifmagic',
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
    title: "Spin Module - Rotary Encoder",
    description: "Track unlimited 360° rotation with rotary encoders. Perfect for scroll wheels and continuous dials.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Spin',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Spin module is a digital input that tracks continuous rotation using a rotary encoder. Unlike the bounded Dial, it can rotate endlessly in either direction, counting steps and rotations. This module can be connected to any digital port.",
      sections: [
        {
          title: "How It Works",
          text: "A digital input module that tracks continuous rotation using a rotary encoder. Unlike a potentiometer (Dial), a rotary encoder doesn't have endpoints - it can spin forever in either direction. It counts discrete steps/clicks as you rotate."
        },
        {
          title: "Spin vs Dial",
          text: "The Dial uses a potentiometer with physical stops (40-330°). The Spin module uses a rotary encoder with NO stops - it rotates 360° continuously. Each click of the encoder registers as a step, and you can count total rotations."
        },
        {
          title: "Direction Detection",
          text: "Rotary encoders use two output signals (quadrature encoding) to detect direction. By checking which signal triggers first, the system knows if you're rotating clockwise or counter-clockwise."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access the spin value using the Magic API:",
          codeExample: "var steps = Magic.modules.spin.steps;\n// Cumulative count (positive=CW, negative=CCW)\n\nvar direction = Magic.modules.spin.direction;\n// 'clockwise' or 'counterclockwise'\n\n// Reset counter\nMagic.modules.spin.reset();\n\n// Example: Scroll through menu\nif (steps > lastSteps) {\n  menuIndex++; // Scrolling down\n} else if (steps < lastSteps) {\n  menuIndex--; // Scrolling up\n}"
        },
        {
          title: "Common Uses",
          text: "Spin/rotary encoders are commonly used for: Mouse scroll wheels, Volume knobs (infinite rotation), Menu navigation, Odometers, Winding mechanisms, 3D printers, and CNC machines."
        }
      ],
      practiceActivity: "Create a color wheel that cycles through hues as you spin - CW for warmer colors, CCW for cooler colors.",
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
    slug: 'move-module-servo-motor-control',
    title: "Move Module - Servo Motor Control",
    description: "Control servo motors with PWM. Learn about angular positioning and motor control fundamentals.",
    duration: "30 min",
    status: 'locked',
    category: 'output',
    path: 'ifmagic',
    module: 'Move',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Move module is a digital output that controls a servo motor. Servo motors can be positioned to specific angles (typically 0-180°) using PWM signals. This module can be connected to any digital port and is commonly used for precise mechanical movement.",
      sections: [
        {
          title: "How It Works",
          text: "A digital output module that controls a servo motor. Servo motors have a built-in control circuit that positions the motor shaft to a specific angle based on the PWM signal. Standard servos rotate 0-180°, while continuous rotation servos spin like regular motors."
        },
        {
          title: "PWM for Servo Control",
          text: "Servos use PWM (Pulse Width Modulation) differently than LEDs. The pulse width determines the angle: ~1ms pulse = 0°, ~1.5ms pulse = 90° (center), ~2ms pulse = 180°. The servo's internal circuit reads these pulses and positions the motor accordingly."
        },
        {
          title: "Port Compatibility",
          text: "The Move module can be connected to any digital port (1-8). All ports support the PWM signals needed for servo control."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Control the servo using the Magic API:",
          codeExample: "// Set angle (0-180 degrees)\nMagic.modules.move.setAngle(90); // Center position\n\n// Sweep from 0 to 180\nfor (var angle = 0; angle <= 180; angle += 10) {\n  Magic.modules.move.setAngle(angle);\n  delay(100);\n}\n\n// For continuous rotation servos:\nMagic.modules.move.setSpeed(50);  // 50% speed forward\nMagic.modules.move.setSpeed(-50); // 50% speed reverse\nMagic.modules.move.stop();"
        },
        {
          title: "Common Uses",
          text: "Servo motors are commonly used for: Robot arms and joints, RC car steering, Pan/tilt camera mounts, Door locks, Automated blinds, Animatronics, and any project requiring precise angular positioning."
        }
      ],
      practiceActivity: "Create a dial-controlled servo - rotate the dial to set the servo angle from 0-180°.",
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
    description: "Master digital signals, logic levels, and GPIO. Understand the foundation of all digital electronics.",
    duration: "25 min",
    status: 'locked',
    category: 'sensor',
    path: 'ifmagic',
    module: 'Digital',
    requiredLevel: 'intermediate',
    content: {
      overview: "The Digital module provides direct access to digital GPIO (General Purpose Input/Output) pins. It handles binary signals - HIGH (1) or LOW (0). This module can be connected to any digital port and is the foundation for understanding all digital electronics.",
      sections: [
        {
          title: "How It Works",
          text: "A digital module that provides direct access to GPIO pins for binary signals. Digital signals have exactly two states: HIGH (1, ON, typically 3.3V or 5V) or LOW (0, OFF, 0V). This binary system is the foundation of all digital computing."
        },
        {
          title: "Digital Input",
          text: "When configured as INPUT, the pin reads external signals. Connect switches, buttons, or other digital sensors. The pin will read HIGH if voltage is applied, LOW if grounded. Most inputs include internal pull-up or pull-down resistors."
        },
        {
          title: "Digital Output",
          text: "When configured as OUTPUT, the pin can drive external components. Set it HIGH to output voltage (light an LED, trigger a relay) or LOW to turn off. Digital outputs can typically source 20-40mA of current."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Access digital I/O using the Magic API:",
          codeExample: "// Read digital input\nvar state = Magic.modules.digital.read();\n// Returns 0 or 1\n\n// Write digital output\nMagic.modules.digital.write(1); // Set HIGH\nMagic.modules.digital.write(0); // Set LOW\n\n// Toggle output\nMagic.modules.digital.toggle();\n\n// Set pin mode\nMagic.modules.digital.setMode('input');\nMagic.modules.digital.setMode('output');"
        },
        {
          title: "Common Uses",
          text: "Digital I/O is fundamental for: Reading switches and buttons, Controlling LEDs and relays, Interfacing with digital sensors, Triggering external circuits, Communication protocols (I2C, SPI), and any binary on/off control."
        }
      ],
      practiceActivity: "Create a digital echo system - when you press a button (digital input), an LED (digital output) lights up.",
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
    description: "Control RGB LEDs with PWM, learn about duty cycles, and create stunning visual feedback systems.",
    duration: "25 min",
    status: 'locked',
    category: 'output',
    path: 'ifmagic',
    module: 'Glow',
    requiredLevel: 'beginner',
    content: {
      overview: "The Glow module is a digital output that controls an RGB LED. It can be set to any color using RGB values (0-255 for each channel) or hex color codes. This module can be connected to any digital port and is commonly used for visual feedback and status indicators.",
      sections: [
        {
          title: "How It Works",
          text: "A digital output module that controls an RGB LED. The Glow can display any color by mixing Red, Green, and Blue light. Each color channel accepts values from 0-255, or you can use hex color codes like '#FF0000' for red."
        },
        {
          title: "Understanding PWM (Pulse Width Modulation)",
          text: "LEDs can only be ON or OFF - they don't have true dimming capability. So how do we control brightness? PWM rapidly switches the LED on and off thousands of times per second. By changing the ratio of on-time to off-time, we create the illusion of different brightness levels."
        },
        {
          title: "Duty Cycle Explained",
          text: "Duty Cycle is the percentage of time a signal is ON during one cycle. 100% duty cycle = always on (full brightness). 50% duty cycle = on half the time (medium brightness). 25% duty cycle = on quarter time (dim). 0% duty cycle = always off. This technique controls LED brightness without analog signals."
        },
        {
          title: "Port Compatibility",
          text: "The Glow module can be connected to any digital port (1-8). All ports support the digital PWM signals needed for LED control."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Control the Glow module using the Magic API:",
          codeExample: "// Set color using hex code\nMagic.modules.glow.setColor('#00FF00'); // Green\n\n// Set color using RGB values\nMagic.modules.glow.setRGB(255, 0, 128); // Pink\n\n// Set brightness (0-100)\nMagic.modules.glow.setBrightness(50);\n\n// Turn off\nMagic.modules.glow.setColor('#000000');"
        },
        {
          title: "Common Uses",
          text: "Glow modules are commonly used for: Status indicators (green=ok, red=error), Mood lighting, Visual feedback for user input, Notifications and alerts, Color-coded information displays, and decorative lighting effects."
        }
      ],
      practiceActivity: "Create a color-changing light that cycles through the rainbow, then make it respond to button presses.",
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
    description: "Generate musical tones, melodies, and audio feedback using piezo buzzers and speakers.",
    duration: "25 min",
    status: 'locked',
    category: 'output',
    path: 'ifmagic',
    module: 'Tone',
    requiredLevel: 'beginner',
    content: {
      overview: "The Tone module is a digital output that generates audio tones using a piezo buzzer or speaker. It can play specific frequencies (musical notes) for specified durations. This module can be connected to any digital port and is commonly used for audio feedback and musical projects.",
      sections: [
        {
          title: "How It Works",
          text: "A digital output module that generates audio tones. The module rapidly toggles a pin to create sound waves. The frequency of toggling determines the pitch - faster toggling = higher pitch. A piezo buzzer or small speaker converts these electrical signals to sound."
        },
        {
          title: "Frequency and Pitch",
          text: "Sound pitch is measured in Hertz (Hz) - cycles per second. Middle C = 262 Hz, A4 (tuning note) = 440 Hz, higher Hz = higher pitch. Human hearing range is approximately 20 Hz to 20,000 Hz."
        },
        {
          title: "Musical Notes",
          text: "Each musical note corresponds to a specific frequency: C4=262Hz, D4=294Hz, E4=330Hz, F4=349Hz, G4=392Hz, A4=440Hz, B4=494Hz, C5=523Hz. Doubling the frequency raises the note by exactly one octave."
        },
        {
          title: "Code Example (JavaScript)",
          text: "Generate tones using the Magic API:",
          codeExample: "// Play a single note (frequency in Hz, duration in ms)\nMagic.modules.tone.play(440, 500); // A4 for 500ms\n\n// Play a melody\nvar melody = [\n  {note: 262, duration: 200}, // C4\n  {note: 294, duration: 200}, // D4\n  {note: 330, duration: 200}, // E4\n  {note: 349, duration: 400}  // F4 (longer)\n];\nMagic.modules.tone.playMelody(melody);\n\n// Stop playing\nMagic.modules.tone.stop();"
        },
        {
          title: "Common Uses",
          text: "Tone modules are commonly used for: Musical instruments, Button click feedback, Alarm sounds, Game sound effects, Notification chimes, Educational music projects, and accessibility audio cues."
        }
      ],
      practiceActivity: "Create a musical keyboard - connect 4 buttons and program each to play a different note (C, D, E, F).",
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
    path: 'ifmagic',
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
    path: 'ifmagic',
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
    path: 'ifmagic',
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
    path: 'ifmagic',
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
    path: 'ifmagic',
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
export const getCurrentUser = (): { id?: string; name: string; email: string; level: UserLevel } | null => {
  const userStr = localStorage.getItem('hardwareHubUser');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

/**
 * API URL for backend sync
 */
const getApiUrl = (): string => {
  if (typeof window !== 'undefined' && import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:3000';
};

const API_URL = getApiUrl();

/**
 * USER LEVEL PROGRESSION
 * Automatically progress user level based on completed lessons
 */

// Get all IF MAGIC lessons by required level
export const getIfMagicLessonsByLevel = (level: UserLevel): Lesson[] => {
  return lessons.filter(l => l.path === 'ifmagic' && l.requiredLevel === level);
};

// Check and update user level based on completed IF MAGIC lessons
export const checkAndUpdateUserLevel = (): { newLevel: UserLevel | null, message: string | null } => {
  const user = getCurrentUser();
  if (!user) return { newLevel: null, message: null };
  
  const completed = getCompletedLessons();
  const currentLevel = user.level || 'beginner';
  
  // Get IF MAGIC lessons for each level
  const beginnerLessons = getIfMagicLessonsByLevel('beginner');
  const intermediateLessons = getIfMagicLessonsByLevel('intermediate');
  
  // Check beginner → intermediate progression
  const allBeginnerComplete = beginnerLessons.every(l => completed.includes(l.id));
  
  // Check intermediate → advanced progression
  const allIntermediateComplete = intermediateLessons.every(l => completed.includes(l.id));
  
  let newLevel: UserLevel | null = null;
  let message: string | null = null;
  
  if (currentLevel === 'beginner' && allBeginnerComplete) {
    newLevel = 'intermediate';
    message = '🎉 Congratulations! You\'ve completed all beginner lessons and advanced to Intermediate level!';
  } else if (currentLevel === 'intermediate' && allBeginnerComplete && allIntermediateComplete) {
    newLevel = 'advanced';
    message = '🏆 Amazing! You\'ve mastered intermediate content and reached Advanced level!';
  }
  
  // Update user level if progression happened
  if (newLevel) {
    const updatedUser = { ...user, level: newLevel };
    localStorage.setItem('hardwareHubUser', JSON.stringify(updatedUser));
    
    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent('levelUp', { 
      detail: { oldLevel: currentLevel, newLevel, message } 
    }));
  }
  
  return { newLevel, message };
};

// Manually set user level (for dev/testing)
export const setUserLevel = (level: UserLevel): void => {
  const user = getCurrentUser();
  if (!user) return;
  
  const updatedUser = { ...user, level };
  localStorage.setItem('hardwareHubUser', JSON.stringify(updatedUser));
  
  window.dispatchEvent(new CustomEvent('levelChanged', { 
    detail: { level } 
  }));
};

// Get current user level
export const getUserLevel = (): UserLevel => {
  const user = getCurrentUser();
  return user?.level || 'beginner';
};

/**
 * LESSON PROGRESS TRACKING (localStorage + backend sync)
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
 * Mark a lesson as completed (localStorage + backend sync)
 */
export const markLessonComplete = async (lessonId: number): Promise<void> => {
  const user = getCurrentUser();
  if (!user) return;
  
  const key = `completedLessons_${user.email}`;
  let completed = getCompletedLessons();
  
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(key, JSON.stringify(completed));
  }
  
  // Check if the current lesson's path is now fully complete
  const currentLesson = lessons.find(l => l.id === lessonId);
  if (currentLesson?.path) {
    const unlocked = checkAndUpdatePathCompletion(currentLesson.path, completed);
    if (unlocked) {
      // Dispatch a custom event so UI can show a notification
      window.dispatchEvent(new CustomEvent('pathUnlocked', { 
        detail: { pathId: currentLesson.path } 
      }));
    }
  }
  
  // Also sync with backend if user has an ID
  if (user.id) {
    try {
      const token = localStorage.getItem('authToken');
      const lesson = lessons.find(l => l.id === lessonId);
      
      await fetch(`${API_URL}/api/progress/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          lesson_id: lessonId,
          lesson_slug: lesson?.slug,
        }),
      });
      
      // Check for new achievements
      await fetch(`${API_URL}/api/achievements/check/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      console.log('Backend sync failed, using local storage only');
    }
  }
  
  // Check for level progression after completing a lesson
  checkAndUpdateUserLevel();
};

/**
 * Check if all lessons in a path are complete and update completedPaths
 * Returns true if a new path was unlocked
 */
const checkAndUpdatePathCompletion = (pathId: string, completedLessonIds: number[]): boolean => {
  // Get all lessons for this path
  const pathLessons = lessons.filter(l => l.path === pathId);
  
  console.log(`[Path Check] Checking "${pathId}": ${completedLessonIds.length} completed, need ${pathLessons.length} lessons`);
  console.log(`[Path Check] Path lesson IDs:`, pathLessons.map(l => l.id));
  console.log(`[Path Check] Completed lesson IDs:`, completedLessonIds);
  
  // Check if all lessons in the path are completed
  const allCompleted = pathLessons.every(lesson => completedLessonIds.includes(lesson.id));
  
  console.log(`[Path Check] All completed: ${allCompleted}`);
  
  if (allCompleted && pathLessons.length > 0) {
    // Get current completed paths from localStorage
    const completedPathsStr = localStorage.getItem('completedPaths');
    const completedPaths: string[] = completedPathsStr ? JSON.parse(completedPathsStr) : [];
    
    // Add this path if not already in the list
    if (!completedPaths.includes(pathId)) {
      completedPaths.push(pathId);
      localStorage.setItem('completedPaths', JSON.stringify(completedPaths));
      console.log(`🎉 Path "${pathId}" completed! Other paths are now unlocked.`);
      return true;
    }
  }
  return false;
};

/**
 * Check all paths for completion status (call on app load to fix any missed unlocks)
 */
export const recheckAllPathCompletions = (): void => {
  const completed = getCompletedLessons();
  const paths = ['getting-started', 'ifmagic'];
  
  console.log('[Recheck] Checking all path completions...');
  console.log('[Recheck] Completed lessons:', completed);
  
  paths.forEach(pathId => {
    const unlocked = checkAndUpdatePathCompletion(pathId, completed);
    if (unlocked) {
      window.dispatchEvent(new CustomEvent('pathUnlocked', { 
        detail: { pathId } 
      }));
    }
  });
};

interface ProgressRecord {
  lesson_id: number;
  completed: boolean;
}

/**
 * Sync local progress with backend (call on login)
 */
export const syncProgressWithBackend = async (): Promise<void> => {
  const user = getCurrentUser();
  if (!user?.id) return;
  
  try {
    const token = localStorage.getItem('authToken');
    const localCompleted = getCompletedLessons();
    
    // Get backend progress
    const response = await fetch(`${API_URL}/api/progress/user/${user.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const backendCompleted = (data.progress as ProgressRecord[] || [])
        .filter((p) => p.completed)
        .map((p) => p.lesson_id);
      
      // Merge local and backend (take union)
      const mergedCompleted = [...new Set([...localCompleted, ...backendCompleted])];
      
      // Save merged to localStorage
      const key = `completedLessons_${user.email}`;
      localStorage.setItem(key, JSON.stringify(mergedCompleted));
      
      // Sync any local-only completions to backend
      const localOnly = localCompleted.filter(id => !backendCompleted.includes(id));
      for (const lessonId of localOnly) {
        const lesson = lessons.find(l => l.id === lessonId);
        await fetch(`${API_URL}/api/progress/complete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: user.id,
            lesson_id: lessonId,
            lesson_slug: lesson?.slug,
          }),
        });
      }
    }
  } catch {
    console.log('Backend sync failed, using local storage only');
  }
};

/**
 * Check if a specific lesson is completed
 */
export const isLessonCompleted = (lessonId: number): boolean => {
  return getCompletedLessons().includes(lessonId);
};

// ==========================================
// TESTING UTILITIES - Available in browser console as window.HardwareHubTest
// ==========================================

/**
 * Testing utilities for development/debugging
 * Access in browser console: window.HardwareHubTest
 */
export const TestUtils = {
  /**
   * Complete a specific lesson by ID
   */
  completeLesson: (lessonId: number) => {
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ No user logged in');
      return;
    }
    const key = `completedLessons_${user.email}`;
    const completed = getCompletedLessons();
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem(key, JSON.stringify(completed));
      console.log(`✅ Lesson ${lessonId} marked complete`);
    } else {
      console.log(`ℹ️ Lesson ${lessonId} already complete`);
    }
    // Check path completion
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson?.path) {
      recheckAllPathCompletions();
    }
  },

  /**
   * Remove completion for a specific lesson
   */
  uncompleteLesson: (lessonId: number) => {
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ No user logged in');
      return;
    }
    const key = `completedLessons_${user.email}`;
    let completed = getCompletedLessons();
    completed = completed.filter(id => id !== lessonId);
    localStorage.setItem(key, JSON.stringify(completed));
    console.log(`✅ Lesson ${lessonId} unmarked`);
  },

  /**
   * Complete all lessons in the Getting Started path
   */
  completeGettingStarted: () => {
    const gettingStartedIds = [0, -1, -2, -3, -4];
    gettingStartedIds.forEach(id => TestUtils.completeLesson(id));
    recheckAllPathCompletions();
    console.log('✅ Getting Started path completed!');
  },

  /**
   * Complete all IF MAGIC lessons
   */
  completeIfMagic: () => {
    const ifMagicLessons = lessons.filter(l => l.path === 'ifmagic');
    ifMagicLessons.forEach(l => TestUtils.completeLesson(l.id));
    recheckAllPathCompletions();
    console.log('✅ IF MAGIC path completed!');
  },

  /**
   * Reset all lesson progress
   */
  resetAllProgress: () => {
    const user = getCurrentUser();
    if (!user) {
      console.error('❌ No user logged in');
      return;
    }
    const key = `completedLessons_${user.email}`;
    localStorage.removeItem(key);
    localStorage.removeItem('completedPaths');
    console.log('✅ All progress reset! Refresh the page.');
  },

  /**
   * Show current progress
   */
  showProgress: () => {
    const completed = getCompletedLessons();
    const paths = localStorage.getItem('completedPaths');
    const gettingStartedLessons = lessons.filter(l => l.path === 'getting-started');
    const ifMagicLessons = lessons.filter(l => l.path === 'ifmagic');
    
    console.log('📊 Current Progress:');
    console.log(`  Completed Lessons: ${completed.length}`);
    console.log(`  Completed IDs:`, completed);
    console.log(`  Completed Paths:`, paths ? JSON.parse(paths) : []);
    console.log(`  Getting Started: ${completed.filter(id => gettingStartedLessons.some(l => l.id === id)).length}/${gettingStartedLessons.length}`);
    console.log(`  IF MAGIC: ${completed.filter(id => ifMagicLessons.some(l => l.id === id)).length}/${ifMagicLessons.length}`);
  },

  /**
   * List all lesson IDs
   */
  listLessons: () => {
    console.log('📚 Getting Started Lessons:');
    lessons.filter(l => l.path === 'getting-started').forEach(l => 
      console.log(`  ID: ${l.id} - ${l.title}`)
    );
    console.log('\n📚 IF MAGIC Lessons:');
    lessons.filter(l => l.path === 'ifmagic').forEach(l => 
      console.log(`  ID: ${l.id} - ${l.title}`)
    );
  }
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).HardwareHubTest = TestUtils;
}
