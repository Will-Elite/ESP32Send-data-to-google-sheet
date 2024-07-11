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
            // Mục đích của đoạn mã này là loại bỏ các phần tử không hợp lệ khỏi mảng.
            const validData = data.filter(item => item.date !== "Day" && item.time !== "Time" && item.distance !== "Distance");
            validData.forEach(item => {
                item.date = formatDate(new Date(item.date));
                item.time = formatTime(new Date(item.time));
            });
            createTable(validData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
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

function createTable(data) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody'); // Sửa lỗi chính tả từ 'ctrateElement' thành 'createElement'

    // Tạo hàng tiêu đề
    const headerRow = document.createElement('tr');
    const headers = ['No', 'Date', 'Time', 'Distance'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Tạo các hàng dữ liệu
    data.forEach((item, index) => {
        const row = document.createElement('tr');

        // Tạo ô số thứ tự
        const serialTd = document.createElement('td');
        serialTd.textContent = index + 1;
        row.appendChild(serialTd);

        // Tạo các ô dữ liệu khác
        Object.values(item).forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById('output').innerHTML = ''; // Xóa nội dung cũ trước khi thêm bảng mới
    document.getElementById('output').appendChild(table);
}
