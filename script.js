document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
  
    function validateUsername(username) {
      if (username.trim() === "") {
        alert("username should not be empty");
        return false;
      }
  
      const regex = /^[a-zA-Z0-9_-]{1,15}$/;
      const isMatching = regex.test(username);
      if (!isMatching) {
        alert("Invalid Username");
        return false;
      }
      return isMatching;
    }
  
    async function fetchUserDetails(username) {
      const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
      try {
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
  
        statsContainer.style.setProperty("display", "none");
  
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Unable to fetch the User details.");
        }
        const PassedData = await response.json();
        console.log("loggin data: ", PassedData);
  
        statsContainer.style.setProperty("display", "block");
        if (
          PassedData.status === "error" &&
          PassedData.message === "user does not exist"
        ) {
          statsContainer.innerHTML = "<p>Username does not exist.</p>";
          return;
        }
  
        displayUserData(PassedData);
      } catch (error) {
        statsContainer.innerHTML = "<p>Data not found.</p>";
      } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
      }
    }
    function updateProgressCircle(solved, total, label, circle) {
      const progressDegree = (solved / total) * 100;
      circle.style.setProperty("--progress-degree", `${progressDegree}%`);
      label.textContent = `${solved} / ${total}`;
    }
    function displayUserData(PassedData) {
      const totalQues = PassedData.totalQuestions;
      const totalEasyQues = PassedData.totalEasy;
      const totalMediumQues = PassedData.totalMedium;
      const totalHardQues = PassedData.totalHard;
  
      const totalSolved = PassedData.totalSolved;
      const easySolved = PassedData.easySolved;
      const mediumSolved = PassedData.mediumSolved;
      const hardSolved = PassedData.hardSolved;
  
      const acceptanceRate = PassedData.acceptanceRate;
      const ranking = PassedData.ranking;
      const contributionPoints = PassedData.contributionPoints;
  
      updateProgressCircle(
        easySolved,
        totalEasyQues,
        easyLabel,
        easyProgressCircle
      );
      updateProgressCircle(
        mediumSolved,
        totalMediumQues,
        mediumLabel,
        mediumProgressCircle
      );
      updateProgressCircle(
        hardSolved,
        totalHardQues,
        hardLabel,
        hardProgressCircle
      );
  
      const cardsData = [
        { label: "Overall Submissions", value: totalSolved },
        { label: "Overall Easy Submissions", value: easySolved },
        { label: "Overall Medium Submissions", value: mediumSolved },
        { label: "Overall Hard Submissions", value: hardSolved },
      ];
      console.log("card data: ", cardsData);
  
      cardStatsContainer.innerHTML = cardsData
        .map((data) => {
          return `<div class="card">
                  <h4>${data.label}</h4>
                  <p>${data.value}</p>
              </div>`;
        })
        .join("");
    }
    searchButton.addEventListener("click", function () {
      const username = usernameInput.value;
      console.log("logging username:", username);
      if (validateUsername(username)) {
        fetchUserDetails(username);
      }
    });
  });
  