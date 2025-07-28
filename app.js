document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const medProgressCircle = document.querySelector(".med-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const medLabel = document.getElementById("med-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUsername(username) {
        if(username.trim() === ""){
            alert("First enter Username");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{3,16}$/;
        const isMatching = regex.test(username);
        return isMatching;
    }

    async function fetchuserDetails(username){
        const URL = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent = "searching...";
            searchButton.disabled = true;

            const response = await fetch(URL);
            if(!response.ok) {
                throw new Error("Unable to fetch User details");
            }

            const data = await response.json();
            if(data.status !== "success") {
                throw new Error("No Data Found!");
            }

            cardStatsContainer.innerHTML = `
            <div class="stats-column">
            <p>Username: ${username}</p>
            <p>Total Solved: ${data.totalSolved} / ${data.totalQuestions}</p>
            <p>Acceptance Rate: ${data.acceptanceRate}%</p>
            </div>

            <div class="stats-column">
            <p>Ranking: ${data.ranking}</p>
            <p>Contribution Points: ${data.contributionPoints}</p>
            <p>Reputation: ${data.reputation}</p>
            </div>
            `;

            const easyPercent = (data.easySolved / data.totalEasy) * 100;
            const medPercent = (data.mediumSolved / data.totalMedium) * 100;
            const hardPercent = (data.hardSolved / data.totalHard) * 100;

            easyProgressCircle.style.setProperty('--progress-degree', `${easyPercent}%`);
            medProgressCircle.style.setProperty('--progress-degree', `${medPercent}%`);
            hardProgressCircle.style.setProperty('--progress-degree', `${hardPercent}%`);

            easyLabel.textContent = `${data.easySolved} / ${data.totalEasy}`;
            medLabel.textContent = `${data.mediumSolved} / ${data.totalMedium}`;
            hardLabel.textContent = `${data.hardSolved} / ${data.totalHard}`;
        }
        catch(error){
            statsContainer.innerHTML = `<p>No Data Found</p>`;
        }
        finally{
            searchButton.textContent = "search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click', function() {
        const username = usernameInput.value;
        if(validateUsername(username)) {
            fetchuserDetails(username);
        }else{
            alert("Please Enter a Valid Username!");
        }
    });
});