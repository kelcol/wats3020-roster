// Create a base class that takes the parameters name and email
// Incl method to extract username from email address
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        // split on @ and assign var to first item in array
        this.username = makeUnique(email.split('@')[0]);
    }
}

// Reduce likelihood of duplicate usernames for attendance marking
function makeUnique(username) {
    let possible = "0123456789";
    for (i = 0; i < 3; i++)
        username += possible.charAt(Math.floor(Math.random() * possible.length));
    return username;
}

// Extend person class into studenthood
class Student extends Person {
    constructor(name, email) {
        super(name, email);
        this.attendance = [];
    }
    calculateAttendance() {
        // check if empty and set counter to zero
        if (this.attendance.length > 0) {
            let counter = 0;
            // allow marks of attendance to be added to counter
            for (let mark of this.attendance) {
                counter = counter + mark;
            }
            let attendancePercentage = counter / this.attendance.length * 100;
            return `${(attendancePercentage.toFixed(2))}%`
        } else {
            return "0%";
        }
    }
}

// Extend person class into teacherhood
class Teacher extends Person {
    constructor(name, email, honorific) {
        super(name, email);
        this.honorific = honorific;
    }
};

// Initialize Course class and attributes
class Course {
    constructor(courseCode, courseTitle, courseDescription) {
        this.code = courseCode;
        this.title = courseTitle;
        this.description = courseDescription;
        this.teacher = null;
        this.students = [];
    }

    // Collect data for a student and add their object to the students array
    addStudent() {
        let name = prompt("Name: ");
        let email = prompt("Email: ");
        let newStudent = new Student(name, email);
        this.students.push(newStudent);
        // Use updateRoster function to add student's info to table
        updateRoster(this);
    }

    // Collect data for the teacher and use updateRoster function to add course attributes
    setTeacher() {
            let name = prompt("Name: ");
            let email = prompt("Email: ");
            let honorific = prompt("Honorific (Mr., Mrs., Ms., Dr., etc.): ");
            this.teacher = new Teacher(name, email, honorific);
            // Use updateRoster function to add teacher's info to table
            updateRoster(this);
        }
        // "Unset" the teacher -- there's maybe a better way to do this?
    removeTeacher() {
        let name = "";
        let email = "";
        let honorific = "";
        this.teacher = new Teacher(name, email, honorific);
        updateRoster(this);
    }

    // Assign username to var student to serve as id for marking purposes
    markAttendance(username, status = "present") {
        let student = this.findStudent(username);
        // add 1 or 0 to array depending on if status is "present"
        if (status === "present") {
            student.attendance.push(1);
        } else {
            student.attendance.push(0);
        }
        // update display table with what updateRoster returns for "this"
        updateRoster(this);
    }

    //////////////////////////////////////////////
    // Methods provided for you -- DO NOT EDIT /////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////

    findStudent(username) {
        // This method provided for convenience. It takes in a username and looks
        // for that username on student objects contained in the `this.students`
        // Array.
        let foundStudent = this.students.find(function(student, index) {
            return student.username == username;
        });
        return foundStudent;
    }
}


// Prompt the user for the `courseCode` (the number/code of the course, like "WATS 3000").
let courseCode = prompt("Course Code: ");

// Prompt the user for the `courseTitle` (the name of the course, like "Introduction to JavaScript").
let courseTitle = prompt("Course Title: ");

// Prompt the user for the  `courseDescription` (the descriptive summary of the course).
let courseDescription = prompt("Course Description: ");

// Instantiate a new Course object with information supplied by the user above
let myCourse = new Course(courseCode, courseTitle, courseDescription);

///////////////////////////////////////////////////
//////// Main Script /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// This script runs the page. You should only edit it if you are attempting a //
// stretch goal. Otherwise, this script calls the functions that you have     //
// created above.                                                             //
////////////////////////////////////////////////////////////////////////////////

let rosterTitle = document.querySelector('#course-title');
rosterTitle.innerHTML = `${myCourse.code}: ${myCourse.title}`;

let rosterDescription = document.querySelector('#course-description');
rosterDescription.innerHTML = myCourse.description;

if (myCourse.teacher) {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = `${myCourse.teacher.honorific} ${myCourse.teacher.name}`;
} else {
    let rosterTeacher = document.querySelector('#course-teacher');
    rosterTeacher.innerHTML = "Not Set";
}

let rosterTbody = document.querySelector('#roster tbody');
// Clear Roster Content
rosterTbody.innerHTML = '';

// Create event listener for adding a student.
let addStudentButton = document.querySelector('#add-student');
addStudentButton.addEventListener('click', function(e) {
    console.log('Calling addStudent() method.');
    myCourse.addStudent();
})

// Create event listener for adding a teacher.
// Create event listener for adding a teacher.
let addTeacherButton = document.querySelector('#add-teacher');
addTeacherButton.addEventListener('click', function(e) {
    console.log('Calling setTeacher() method.');
    myCourse.setTeacher();
})

let removeTeacherButton = document.querySelector('#remove-teacher');
removeTeacherButton.addEventListener('click', function(e) {
    console.log('Calling removeTeacher() method.');
    myCourse.removeTeacher();
})

// Call Update Roster to initialize the content of the page.
updateRoster(myCourse);

function updateRoster(course) {
    let rosterTbody = document.querySelector('#roster tbody');
    // Clear Roster Content
    rosterTbody.innerHTML = '';
    if (course.teacher) {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = `${course.teacher.honorific} ${course.teacher.name}`;
    } else {
        let rosterTeacher = document.querySelector('#course-teacher');
        rosterTeacher.innerHTML = "Not Set";
    }
    // Populate Roster Content
    for (student of course.students) {
        // Create a new row for the table.
        let newTR = document.createElement('tr');

        // Create table cells for each data point and append them to the new row.
        let nameTD = document.createElement('td');
        nameTD.innerHTML = student.name;
        newTR.appendChild(nameTD);

        let emailTD = document.createElement('td');
        emailTD.innerHTML = student.email;
        newTR.appendChild(emailTD);

        let attendanceTD = document.createElement('td');
        attendanceTD.innerHTML = student.calculateAttendance();
        newTR.appendChild(attendanceTD);

        let actionsTD = document.createElement('td');
        let presentButton = document.createElement('button');
        presentButton.innerHTML = "Present";
        presentButton.setAttribute('data-username', student.username);
        presentButton.setAttribute('class', 'present');
        actionsTD.appendChild(presentButton);

        let absentButton = document.createElement('button');
        absentButton.innerHTML = "Absent";
        absentButton.setAttribute('data-username', student.username);
        absentButton.setAttribute('class', 'absent');
        actionsTD.appendChild(absentButton);

        newTR.appendChild(actionsTD);

        // Append the new row to the roster table.
        rosterTbody.appendChild(newTR);
    }
    // Call function to set event listeners on attendance buttons.
    setupAttendanceButtons();
}

function setupAttendanceButtons() {
    // Set up the event listeners for buttons to mark attendance.
    let presentButtons = document.querySelectorAll('.present');
    for (button of presentButtons) {
        button.addEventListener('click', function(e) {
            console.log(`Marking ${e.target.dataset.username} present.`);
            myCourse.markAttendance(e.target.dataset.username);
            updateRoster(myCourse);
        });
    }
    let absentButtons = document.querySelectorAll('.absent');
    for (button of absentButtons) {
        button.addEventListener('click', function(e) {
            console.log(`Marking ${e.target.dataset.username} absent.`);
            myCourse.markAttendance(e.target.dataset.username, 'absent');
            updateRoster(myCourse);
        });
    }
}