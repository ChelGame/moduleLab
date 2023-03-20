function tableHandler (event) {
    let targetRow, targetCol;

    // Получаем номер строки.
    event.currentTarget.querySelectorAll("tr").forEach((item, i) => {
        if (item === event.target.parentElement) targetRow = i;
    });

    // Получаем номер столбца
    event.target.parentElement.querySelectorAll('td').forEach((item, i) => {
        if (item === event.target) targetCol = i
    });

    if (targetRow === 1) {
        event.currentTarget.querySelectorAll("tr").forEach((item, j) => {
            if (j === targetRow) return;

            item.querySelectorAll('td').forEach((item, k) => {
                if (k === 0) return;
                if (targetCol === k) {
                    if (item.style.backgroundColor) item.style = null;
                    else item.style.backgroundColor = "#8f5252";
                } else {
                    item.style = null;
                }
            });
        });
    }
}

export default tableHandler;
