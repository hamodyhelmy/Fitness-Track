document.addEventListener('DOMContentLoaded', () => {
    const goalType = document.getElementById('goalType');
    const goalTitle = document.getElementById('goalTitle');
    const goalDescription = document.getElementById('goalDescription');
    const goalDeadline = document.getElementById('goalDeadline');
    const saveGoalBtn = document.getElementById('saveGoalBtn');
    const userGoalsList = document.getElementById('userGoalsList');

    // Load goals from Local Storage
    const loadGoalsFromLocalStorage = () => {
        const storedGoals = JSON.parse(localStorage.getItem('userGoals')) || [];
        userGoalsList.innerHTML = '';  // Clear the list
        storedGoals.forEach(goal => {
            const li = document.createElement('li');
            li.textContent = `${goal.title} - ${goal.description} - Deadline: ${goal.deadline}`;
            userGoalsList.appendChild(li);
        });
    };

    // Save goals to Local Storage
    const saveGoalsToLocalStorage = (goals) => {
        localStorage.setItem('userGoals', JSON.stringify(goals));
    };

    // Fetch goals for the logged-in user on page load (for server-side data)
    const fetchGoals = async () => {
        try {
            const response = await fetch('/api/user_goals', { method: 'GET' });
            const data = await response.json();
            const goals = data.goals || [];  // Ensure it falls back to an empty array if no goals found
            
            // Save fetched goals to Local Storage
            saveGoalsToLocalStorage(goals);

            loadGoalsFromLocalStorage();  // Refresh the goals list from Local Storage
        } catch (error) {
            console.error('Error fetching goals:', error);
            loadGoalsFromLocalStorage();  // Fallback to loading from Local Storage if fetching fails
        }
    };

    // Save a new goal
    saveGoalBtn.addEventListener('click', async () => {
        const goalData = {
            type: goalType.value,
            title: goalTitle.value.trim(),
            description: goalDescription.value.trim(),
            deadline: goalDeadline.value,
        };

        if (!goalData.title || !goalData.deadline) {
            alert('Please fill in all fields before saving.');
            return;
        }

        try {
            const response = await fetch('/api/user_goals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                alert('Goal saved successfully!');

                // Get the updated goals list from the server
                fetchGoals(); 
            } else {
                alert('Failed to save goal.');
            }
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    });

    // Load goals on page load
    loadGoalsFromLocalStorage();  // First, try loading from Local Storage
    fetchGoals(); // Then, fetch from the server and update Local Storage
});
