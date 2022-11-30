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
  static studentOption = document.getElementById('student');
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

  static fillStudentData(selectedClass) {
    const filteredReportCards = Data.reportCards.filter(reportCard => reportCard.class === selectedClass);

    UI.removeChilds(UI.studentOption);

    UI.studentOption.appendChild(UI.createOptionElement('Select Student', '', true, true));

    filteredReportCards.sort((a, b) => {
      if (a.name > b.name) return 1;
      if (a.name < b.name) return -1;
      return 0;
    });

    filteredReportCards.forEach(reportCard => {
      UI.studentOption.appendChild(UI.createOptionElement(`${reportCard.name} (${reportCard.id})`, reportCard.id));
    });
  }

  static handleClassChange() {
    UI.classOption.addEventListener('change', function (e) {
      const selectedClass = e.target.value;
      Helper.fillStudentData(selectedClass);
      UI.reportCard.classList.add('hide');
      UI.erorrMessage.parentElement.classList.add('hide');
    });
  }

  static handleDOBInput() {
    UI.dobInput.addEventListener('input', function (e) {
      const dobInYYMMDD = e.target.value.split('-');
      const learnerDob = `${dobInYYMMDD[2]}/${dobInYYMMDD[1]}/${dobInYYMMDD[0]}`;
      const learnerClass = UI.classOption.value;
      const learnerId = UI.studentOption.value;

      learnerClass && learnerId && learnerDob && Helper.showReportCard(learnerId, learnerDob);

      (learnerClass && learnerId) || Helper.showError("Oops, you have missed some fields.");

    });
  }

  static showReportCard(id, dob) {

    const learnerReportcard = Data.reportCards
      .filter(reportCard => reportCard.id == id)
      .filter(reportCard => reportCard.dateOfBirth == dob);

    if (learnerReportcard.length > 0) {
      const learnerName = learnerReportcard[0].name;
      const learnerClass = learnerReportcard[0].class;
      const learnerDOB = learnerReportcard[0].dateOfBirth;
      const learnerReportURL = learnerReportcard[0].reportCardURL;

      UI.profileDetails.name.textContent = learnerName;
      UI.profileDetails.class.textContent = learnerClass;
      UI.profileDetails.dob.textContent = learnerDOB;
      UI.profileDetails.url.setAttribute('href', learnerReportURL);

      UI.reportCard.classList.remove('hide');
      UI.erorrMessage.parentElement.classList.add('hide');
    } else {
      Helper.showError('Sorry, We are not able to find you.');
    }
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
  Helper.handleClassChange();
  Helper.handleDOBInput();
}

// Execution Starts Here

main(); 