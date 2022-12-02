class Data {
  static reportCards;

  static async getReportCards(url) {
    const response = await fetch(url);
    const data = await response.json();
    Data.reportCards = data;
  }

  static getAll(key = 'id', reportCards = Data.reportCards) {

    let values = {};
    reportCards.forEach(reportCard => {
      if (values[reportCard[key]] === undefined) {
        values[reportCard[key]] = 1;
      }
      else {
        values[reportCard[key]]++;
      }
    });
    return values;
  }

}

class UI {
  static classOption = document.getElementById('class');
  static firstNameField = document.getElementById('firstName');
  static lastNameField = document.getElementById('lastName');
  static dobInput = document.getElementById('dob');
  static reportCard = document.querySelector('.report-card');
  static profileDetails = {
    name: UI.reportCard.querySelector('.profile-details .name'),
    class: UI.reportCard.querySelector('.profile-details .class'),
    dob: UI.reportCard.querySelector('.profile-details .dob'),
    url: UI.reportCard.querySelector('.profile-details .url'),
  }
  static erorrMessage = document.querySelector('.error-box .message');

  static createOptionElement(label, value = "", isDisabled = false, isSelected = false) {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    option.appendChild(document.createTextNode(label));

    isDisabled && option.setAttribute('disabled', true);
    isSelected && option.setAttribute('selected', true);

    return option;
  }

  static removeChilds(element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  }
}

class Helper {

  static fillClassData() {
    const classListObject = Data.getAll('class');
    const classList = Object.keys(classListObject);

    UI.classOption.appendChild(UI.createOptionElement('Select Class', '', true, true));

    classList.forEach(aClass => {
      UI.classOption.appendChild(UI.createOptionElement(aClass, aClass));
    });
  }

  static handleFormChange() {
    UI.classOption.addEventListener('change', Helper.validateReport);
    UI.firstNameField.addEventListener('input', Helper.validateReport);
    UI.lastNameField.addEventListener('input', Helper.validateReport);
    UI.dobInput.addEventListener('input', Helper.validateReport);
  }

  static validateReport() {
    const learnerClass = UI.classOption.value;
    const dobInput = UI.dobInput.value;
    const firstName = UI.firstNameField.value;
    const lastName = UI.lastNameField.value;

    if (learnerClass && firstName && lastName && dobInput) {
      const dobInYYMMDD = dobInput.split('-');
      const learnerDob = `${dobInYYMMDD[2]}/${dobInYYMMDD[1]}/${dobInYYMMDD[0]}`;

      const learnerReportcard = Data.reportCards
        .filter(reportCard => reportCard.class == learnerClass)
        .filter(reportCard => reportCard.dateOfBirth == learnerDob)

      if (learnerReportcard.length > 0) {
        let name = learnerReportcard[0].name.split(' ');
        let learnerFirstName = name[1];
        let learnerLastName = name[0];

        if (learnerFirstName.toLowerCase() == firstName.toLowerCase().trim() && learnerLastName.toLowerCase() == lastName.toLowerCase().trim()) {
          Helper.showReportCard(learnerReportcard[0]);
        } else {
          Helper.showError('Sorry, we are not able to find you.');
        }
      } else {
        Helper.showError('Sorry, we are not able to find you.');
      }

    } else {
      Helper.showError("Oops... please fill all the fields.");
    }
  }

  static showReportCard(reportCard) {

    const learnerName = reportCard.name;
    const learnerClass = reportCard.class;
    const learnerDOB = reportCard.dateOfBirth;
    const learnerReportURL = reportCard.reportCardURL;

    UI.profileDetails.name.textContent = learnerName;
    UI.profileDetails.class.textContent = learnerClass;
    UI.profileDetails.dob.textContent = learnerDOB;
    UI.profileDetails.url.setAttribute('href', learnerReportURL);

    UI.reportCard.classList.remove('hide');
    UI.erorrMessage.parentElement.classList.add('hide');
  }

  static showError(message) {
    UI.reportCard.classList.add('hide');
    UI.erorrMessage.parentElement.classList.remove('hide');
    UI.erorrMessage.textContent = message;
  }

}

async function main() {
  await Data.getReportCards('./reportCards.json');
  Helper.fillClassData();
  Helper.handleFormChange();
}

// Execution Starts Here

main(); 