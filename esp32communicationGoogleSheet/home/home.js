document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    setInterval(fetchData, 20000); // Tải lại dữ liệu mỗi 20 giây
});

function fetchData() {
    // URL của Web App Google Apps Script
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwkiacekZHIiZaDdNr_O_L9PKSCxu5HDYAf0K_XyjVTO7BGmwuDTITd2M7ZMGQdpbvw/exec';
    
    fetch(scriptUrl)
        .then(response => response.json())
        .then(data => {
            // Lọc dữ liệu hợp lệ
            const validData = data.filter(item => item.date !== "Day" && item.time !== "Time" && item.distance !== "Distance");
            if (validData.length > 0) {
                const lastItem = validData[validData.length - 1];
                lastItem.date = formatDate(new Date(lastItem.date));
                lastItem.time = formatTime(new Date(lastItem.time));
                displayLastItem(lastItem);
            } else {
                document.getElementById('output').textContent = 'No valid data available';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('output').textContent = 'Error fetching data';
        });
}

function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; // tháng bắt đầu từ 0
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
}

function displayLastItem(item) {
    const output = document.getElementById('output');
    output.innerHTML = `
        <p><strong>Date:</strong> ${item.date}</p>
        <p><strong>Time:</strong> ${item.time}</p>
        <p><strong>Distance:</strong> ${item.distance}</p>
    `;
}
