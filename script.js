document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const smallBtn = document.getElementById("smallBtn");
    const largeBtn = document.getElementById("largeBtn");
    const resetBtn = document.getElementById("resetBtn");
    const saveBtn = document.getElementById("saveBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const itemNameInput = document.getElementById("itemName");
    const questionsDiv = document.getElementById("questions");
    const resultDiv = document.getElementById("result");
    const resultText = document.getElementById("resultText");
    const actionSelect = document.getElementById("actionSelect");
    const introDiv = document.getElementById("intro");
    const itemClassificationDiv = document.getElementById("itemClassification");
    const questionnaireDiv = document.getElementById("questionnaire");

    // Define questions for both categories
    const smallItemQuestions = [
        {
            question: "Does this inspire any joy or practical use?",
            type: "yesno"
        },
        {
            question: "Could this be easily replaced or is it just taking up space?",
            type: "yesno"
        }
    ];

    const largeItemQuestions = [
        {
            question: "How likely am I to really need this?",
            type: "yesno"
        },
        {
            question: "Does this have significant sentimental value?",
            type: "yesno"
        }
    ];

    let selectedQuestions = [];
    let inventory = [];

    function displayQuestions() {
        questionsDiv.innerHTML = "";
        selectedQuestions.forEach((q, index) => {
            const questionElement = document.createElement("div");
            questionElement.innerHTML = `
                <p>${q.question}</p>
                <button class="answerBtn" data-answer="yes" data-index="${index}">Yes</button>
                <button class="answerBtn" data-answer="no" data-index="${index}">No</button>
            `;
            questionsDiv.appendChild(questionElement);
        });

        const answerBtns = document.querySelectorAll(".answerBtn");
        answerBtns.forEach(btn => {
            btn.addEventListener("click", handleAnswer);
        });
    }

    function handleAnswer(event) {
        const answer = event.target.dataset.answer;
        const index = event.target.dataset.index;

        // Logic to determine the result based on the answer
        let resultCategory = "Keep"; // Default category

        if (selectedQuestions[index].question.includes("need")) {
            resultCategory = answer === "no" ? "Recycle" : "Keep";
        } else if (selectedQuestions[index].question.includes("sentimental")) {
            resultCategory = answer === "yes" ? "Keep" : "Recycle";
        } else if (selectedQuestions[index].question.includes("joy")) {
            resultCategory = answer === "yes" ? "Keep" : "Recycle";
        } else if (selectedQuestions[index].question.includes("replace")) {
            resultCategory = answer === "yes" ? "Sell" : "Keep";
        }

        resultText.textContent = `Suggested action: ${resultCategory}.`;
        introDiv.style.display = "none";
        questionnaireDiv.style.display = "none";
        resultDiv.style.display = "block";
    }

    function saveItem() {
		const itemName = itemNameInput.value.trim();
		const action = actionSelect.value;

		if (itemName === "") {
			alert("Please enter an item name.");
			return;
		}

		inventory.push({ name: itemName, action: action });

		// Show the "Inventory Updated" message
		const inventoryUpdatedMsg = document.getElementById("inventoryUpdatedMsg");
		inventoryUpdatedMsg.style.display = "block";
		setTimeout(() => {
			inventoryUpdatedMsg.style.display = "none";
		}, 2000); // Hide after 2 seconds

		downloadBtn.style.display = "block";
		resetForm();
	}


    function resetForm() {
        itemNameInput.value = "";
        resultDiv.style.display = "none";
        itemClassificationDiv.style.display = "block";
    }

    function downloadInventory() {
        const csvContent = "data:text/csv;charset=utf-8,"
            + inventory.map(e => `${e.name},${e.action}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    startBtn.addEventListener("click", () => {
        introDiv.style.display = "none";
        itemClassificationDiv.style.display = "block";
    });

    smallBtn.addEventListener("click", () => {
        selectedQuestions = smallItemQuestions;
        itemClassificationDiv.style.display = "none";
        questionnaireDiv.style.display = "block";
        displayQuestions();
    });

    largeBtn.addEventListener("click", () => {
        selectedQuestions = largeItemQuestions;
        itemClassificationDiv.style.display = "none";
        questionnaireDiv.style.display = "block";
        displayQuestions();
    });

    resetBtn.addEventListener("click", resetForm);
    saveBtn.addEventListener("click", saveItem);
    downloadBtn.addEventListener("click", downloadInventory);
});
