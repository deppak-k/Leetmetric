document.addEventListener("DOMContentLoaded", function () {

    const searchbutton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");

    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardsStatsContainer=document.querySelector(".stats-cards");


    // ✅ Step 1: Define fetchUserDetails BEFORE using it


    async function fetchUserDetails(username) {
        try {
            searchbutton.textContent = "Searching...";
            searchbutton.disabled = true;

            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const targetUrl = 'https://leetcode.com/graphql';

            const query = `
                query userSessionProgress($username: String!) {
                    allQuestionsCount {
                        difficulty
                        count
                    }
                    matchedUser(username: $username) {
                        submitStats {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                    }
                }
            `;

            const response = await fetch(proxyUrl + targetUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query,
                    variables: { username }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Error ${response.status}: ${errText}`);
            }

            const parsedData = await response.json();
            console.log("✅ LeetCode Data:", parsedData);

            displayUserData(parsedData);

        } catch (error) {
            console.error("❌ Fetch failed:", error);
            statsContainer.innerHTML = '<p>No data found.</p>';
        } finally {
            searchbutton.textContent = "Search";
            searchbutton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(parsedData) {
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

        cardData = [
        {label: "overAll Submission", value : parsedData.data.matchedUser.submitStats.acSubmissionNum[0].submissions},
        {label: "overAll easy Submission", value : parsedData.data.matchedUser.submitStats.acSubmissionNum[1].submissions},
        {label: "overAll medium Submission", value : parsedData.data.matchedUser.submitStats.acSubmissionNum[2].submissions},
        {label: "overAll hard Submission", value : parsedData.data.matchedUser.submitStats.acSubmissionNum[3].submissions}
    ]

    console.log("card data",cardData);

    cardsStatsContainer.innerHTML=cardData.map(
        data=>
            `<div class="card">
            <h5>${data.label}</h5>
            <p>${data.value}</p>
            </div>`
    ).join("")
    }

    

    // ✅ Step 2: Event listener AFTER function definition
    searchbutton.addEventListener('click', function () {
        const username = usernameInput.value.trim();
        if (username) {
            fetchUserDetails(username);
        }
    });

});
