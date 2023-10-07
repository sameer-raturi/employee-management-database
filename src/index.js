(async function () {
  const response = await fetch("./src/data.json");
  let employeeList = await response.json();
  let selectedEmpId;
  const employeeListElement = document.querySelector(".emp-list");
  const employeeInfoElement = document.querySelector(".emp-info");

  // elements to manipulate modal
  const addEmployeeBtn = document.querySelector(".add-employee-btn");
  const addEmployeeModal = document.querySelector(
    ".add-employee-modal-container"
  );
  const addEmployeeForm = document.querySelector(".add-employee-form");

  // render the employees in the targetted div
  const getEmployeeElement = (employee) => {
    const employeeElement = document.createElement("div");
    const name = document.createElement("h4");
    const closeIcon = document.createElement("img");
    employeeElement.classList.add("employee");

    closeIcon.src = "./src/assets/xmark-solid.svg";
    closeIcon.classList.add("close-icon");
    name.innerText = `${employee.firstName} ${employee.lastName}`;

    employeeElement.appendChild(name);
    employeeElement.appendChild(closeIcon);

    if (employee.id == selectedEmpId) {
      employeeElement.classList.add("selected");
    }
    employeeElement.setAttribute("id", employee.id);

    return employeeElement;
  };

  const renderEmployees = () => {
    employeeListElement.innerHTML = "";
    employeeList.forEach((employee) => {
      const employeeElement = getEmployeeElement(employee);
      employeeListElement.appendChild(employeeElement);
    });
  };
  renderEmployees();

  employeeListElement.addEventListener("click", (e) => {
    const divElement = e.target.closest("div"); // Find the nearest ancestor DIV
    console.log(e);
    // deleting element logic
    if (e.target.tagName == "IMG") {
      employeeList = employeeList.filter((emp) => emp.id != divElement.id);
      renderEmployees();
      return;
    }

    // selecting element logic

    if (divElement && selectedEmpId != divElement.id) {
      selectedEmpId = divElement.id;
      renderEmployees(); //here we are re rendering it only to apply the style for the selected item
      renderSelectedEmployee();
    }
  });

  // render the info of the selected employee;

  const renderSelectedEmployee = () => {
    const employee = employeeList.find((emp) => emp.id == selectedEmpId);
    employeeInfoElement.innerHTML = `<img class="user-img"  src='${employee.imageUrl}'/>
            <h3 class="user-address">
            ${employee.address}
            </h3>
            <h3 class="user-mail">
            ${employee.email}
            </h3>
            <h3 class="user-mobile-no">
            ${employee.contactNumber}
            </h3>
            <h3 class="user-dob">
            ${employee.dob}
            </h3>`;
  };

  // modal manipulation to add employee

  // opening the modal
  addEmployeeBtn.addEventListener("click", (e) => {
    addEmployeeModal.classList.toggle("toggle-display");
  });

  addEmployeeModal.addEventListener("click", (e) => {
    // to make modal dissapear if we click outside the modal
    console.log(e);
    if (e.target.classList.contains("add-employee-modal-container")) {
      addEmployeeModal.classList.toggle("toggle-display");
    }
  });

  // closing the modal on submit
  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(e);
    const formData = new FormData(addEmployeeForm);
    console.log(formData);
    const values = [...formData.entries()];
    console.log(values);
    const employeeDataObject = values.reduce(
      (acc, curr) => ({ ...acc, [curr[0]]: curr[1] }),
      {}
    );
    employeeDataObject.id = employeeList[employeeList.length - 1].id + 1;
    const age =
      new Date().getFullYear() - new Date(employeeDataObject.dob).getFullYear();
    employeeDataObject.age = age;
    employeeDataObject.imageUrl =
      employeeDataObject.imageUrl ||
      "https://cdn-icons-png.flaticon.com/512/0/93.png";
    console.log(employeeDataObject);
    employeeList.push(employeeDataObject);

    renderEmployees();
    addEmployeeModal.classList.toggle("toggle-display");
    addEmployeeForm.reset(); // this will empty the values again
  });
})();
