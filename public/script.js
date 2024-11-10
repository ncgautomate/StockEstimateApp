// script.js

console.log('script.js loaded');

// Initialize ticker symbols with default 'DOGE'
let tickerSymbols = ['DOGE'];

// Function to populate ticker symbol dropdowns
function populateTickerDropdowns() {
    const tickerSelects = document.querySelectorAll('.tickerSelect');
    tickerSelects.forEach(select => {
        // Clear existing options
        select.innerHTML = '';
        
        // Populate with current ticker symbols
        tickerSymbols.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            select.appendChild(option);
        });
    });
}

// Function to render the ticker symbols list in the management section
function renderTickerList() {
    const tickerList = document.getElementById('tickerList');
    tickerList.innerHTML = ''; // Clear existing list
    
    tickerSymbols.forEach(symbol => {
        const li = document.createElement('li');
        li.textContent = symbol;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.dataset.symbol = symbol;
        removeBtn.addEventListener('click', removeTickerSymbol);
        
        li.appendChild(removeBtn);
        tickerList.appendChild(li);
    });
}

// Function to add a new ticker symbol
function addTickerSymbol(event) {
    event.preventDefault();
    const newTickerInput = document.getElementById('newTickerSymbol');
    const newSymbol = newTickerInput.value.trim().toUpperCase();
    
    // Validate ticker symbol (e.g., only letters and numbers)
    const tickerRegex = /^[A-Z0-9]+$/;
    if (!tickerRegex.test(newSymbol)) {
        alert('Please enter a valid Ticker Symbol (letters and numbers only).');
        return;
    }
    
    if (tickerSymbols.includes(newSymbol)) {
        alert('Ticker Symbol already exists.');
        return;
    }
    
    tickerSymbols.push(newSymbol);
    newTickerInput.value = '';
    renderTickerList();
    populateTickerDropdowns();
}

// Function to remove a ticker symbol
function removeTickerSymbol(event) {
    const symbolToRemove = event.target.dataset.symbol;
    
    // Prevent removing the last remaining ticker symbol
    if (tickerSymbols.length === 1) {
        alert('At least one Ticker Symbol must exist.');
        return;
    }
    
    tickerSymbols = tickerSymbols.filter(symbol => symbol !== symbolToRemove);
    renderTickerList();
    populateTickerDropdowns();
}

// Function to add a new investment entry
function addInvestmentEntry() {
    const investmentEntries = document.getElementById('investmentEntries');
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('investment-entry');
    entryDiv.innerHTML = `
        <label>Investment Amount ($):</label>
        <input type="number" name="investmentAmount" placeholder="Enter investment amount" required>
        
        <label>Buy Price per Share ($):</label>
        <input type="number" name="buyPrice" placeholder="Enter buy price per share" step="0.0001" required>
        
        <label>Ticker Symbol:</label>
        <select name="tickerSymbol" class="tickerSelect" required>
            <!-- Options will be populated dynamically -->
        </select>
        
        <button type="button" class="remove-entry">Remove</button>
    `;
    investmentEntries.appendChild(entryDiv);
    
    // Attach event listener to the new remove button
    entryDiv.querySelector('.remove-entry').addEventListener('click', () => {
        investmentEntries.removeChild(entryDiv);
    });
    
    // Populate the new dropdown
    populateTickerDropdowns();
}

// Function to perform calculations
async function performCalculations() {
    console.log('performCalculations called');
    const investmentForm = document.getElementById('investmentForm');
    const entries = investmentForm.querySelectorAll('.investment-entry');
    const sellPriceInput = document.getElementById('sellPrice');
    const calculateButton = document.getElementById('calculateButton');
    const loadingIndicator = document.getElementById('loading');
    
    // Show loading indicator and disable calculate button
    loadingIndicator.style.display = 'flex'; // Changed to 'flex' to align spinner and text
    calculateButton.disabled = true;
    
    let totalInvestment = 0;
    let totalShares = 0;
    let totalSellPrice = 0;
    let totalProfitLoss = 0;
    
    // Array to store ticker symbols for Firestore
    const tickerSymbolsForFirestore = [];
    
    // Validate all entries before proceeding
    for (let entry of entries) {
        const investmentAmountInput = entry.querySelector('input[name="investmentAmount"]');
        const buyPriceInput = entry.querySelector('input[name="buyPrice"]');
        const tickerSymbolSelect = entry.querySelector('select[name="tickerSymbol"]'); // Changed to select
        
        const investmentAmount = parseFloat(investmentAmountInput.value);
        const buyPrice = parseFloat(buyPriceInput.value);
        const tickerSymbol = tickerSymbolSelect.value.trim().toUpperCase(); // From dropdown
        
        console.log(`Investment Amount: ${investmentAmount}, Buy Price: ${buyPrice}, Ticker Symbol: ${tickerSymbol}`);
        
        if (isNaN(investmentAmount) || isNaN(buyPrice) || investmentAmount <= 0 || buyPrice <= 0 || tickerSymbol === '') {
            alert('Please enter valid positive numbers for Investment Amount and Buy Price, and select a Ticker Symbol in all entries.');
            console.error('Invalid input detected. Aborting calculations.');
            // Hide loading indicator and enable calculate button
            loadingIndicator.style.display = 'none';
            calculateButton.disabled = false;
            return;
        }
        
        totalInvestment += investmentAmount;
        totalShares += investmentAmount / buyPrice;
        tickerSymbolsForFirestore.push(tickerSymbol);
    }
    
    console.log(`Total Investment: ${totalInvestment}, Total Shares: ${totalShares}`);
    
    const sellPrice = parseFloat(sellPriceInput.value || 0);
    
    console.log(`Sell Price: ${sellPrice}`);
    
    // Calculate total buy price
    const totalBuyPrice = totalInvestment;
    console.log(`Total Buy Price: ${totalBuyPrice}`);
    
    // Calculate total sell price
    totalSellPrice = sellPrice > 0 ? totalShares * sellPrice : 0;
    console.log(`Total Sell Price: ${totalSellPrice}`);
    
    // Calculate total profit or loss
    totalProfitLoss = sellPrice > 0 ? totalSellPrice - totalBuyPrice : 0;
    console.log(`Total Profit/Loss: ${totalProfitLoss}`);
    
    // Calculate average price per share based solely on buy price
    const averagePrice = totalBuyPrice / totalShares;
    console.log(`Average Price per Share: ${averagePrice}`);
    
    // Calculate average sell price
    const averageSellPrice = sellPrice > 0 ? totalSellPrice / totalShares : 0;
    console.log(`Average Sell Price per Share: ${averageSellPrice}`);
    
    // Display results
    try {
        document.getElementById('totalShares').innerText = `Total Shares: ${totalShares.toFixed(2)}`;
        document.getElementById('totalBuyPrice').innerText = `Total Buy Price: $${totalBuyPrice.toFixed(2)}`;
        if (sellPrice > 0) {
            document.getElementById('totalSellPrice').innerText = `Total Sell Price: $${totalSellPrice.toFixed(2)}`;
            document.getElementById('totalProfitLoss').innerText = `Total Profit/Loss: $${totalProfitLoss.toFixed(2)}`;
            document.getElementById('averageSellPrice').innerText = `Average Sell Price per Share: $${averageSellPrice.toFixed(4)}`;
        } else {
            document.getElementById('totalSellPrice').innerText = '';
            document.getElementById('totalProfitLoss').innerText = '';
            document.getElementById('averageSellPrice').innerText = '';
        }
        document.getElementById('averagePrice').innerText = `Average Price per Share: $${averagePrice.toFixed(4)}`;
    } catch (error) {
        console.error('Error displaying results:', error);
        alert('An error occurred while displaying the results. Please check the console for more details.');
    }
    
    // Save calculations to Firestore
    const calculations = [];
    entries.forEach(entry => {
        const investmentAmount = parseFloat(entry.querySelector('input[name="investmentAmount"]').value);
        const buyPrice = parseFloat(entry.querySelector('input[name="buyPrice"]').value);
        const tickerSymbol = entry.querySelector('select[name="tickerSymbol"]').value.trim().toUpperCase();
        
        const shares = investmentAmount / buyPrice;
        const buyTotal = investmentAmount;
        const sellTotal = sellPrice > 0 ? shares * sellPrice : 'N/A';
        const profitLoss = sellPrice > 0 ? sellTotal - buyTotal : 'N/A';
        const avgPrice = buyPrice; // Since it's per share based on buy price
        
        const calculationData = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            tickerSymbol: tickerSymbol,
            totalShares: shares.toFixed(2),
            totalBuyPrice: buyTotal.toFixed(2),
            totalSellPrice: sellPrice > 0 ? sellTotal.toFixed(2) : 'N/A',
            totalProfitLoss: sellPrice > 0 ? profitLoss.toFixed(2) : 'N/A',
            averagePrice: avgPrice.toFixed(4),
            averageSellPrice: sellPrice > 0 ? averageSellPrice.toFixed(4) : 'N/A',
            isAggregate: false // Flag to indicate individual calculation
        };
        
        calculations.push(calculationData);
    });
    
    // Aggregate Calculation Data
    const aggregateCalculationData = {
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        tickerSymbol: 'Aggregate',
        totalShares: totalShares.toFixed(2),
        totalBuyPrice: totalBuyPrice.toFixed(2),
        totalSellPrice: sellPrice > 0 ? totalSellPrice.toFixed(2) : 'N/A',
        totalProfitLoss: sellPrice > 0 ? totalProfitLoss.toFixed(2) : 'N/A',
        averagePrice: averagePrice.toFixed(4),
        averageSellPrice: sellPrice > 0 ? averageSellPrice.toFixed(4) : 'N/A',
        isAggregate: true // Flag to indicate aggregate calculation
    };
    
    // Add aggregate calculation to calculations array
    calculations.push(aggregateCalculationData);
    
    // Use Promise.all to handle multiple Firestore writes
    const savePromises = calculations.map(calc => window.db.collection('calculations').add(calc));
    
    Promise.all(savePromises)
        .then(() => {
            console.log('All calculations saved successfully!');
        })
        .catch((error) => {
            console.error('Error saving calculations:', error);
            alert('An error occurred while saving the calculations. Please check the console for more details.');
        })
        .finally(() => {
            // Clear input fields after saving
            clearInputFields();
            // Hide loading indicator and enable calculate button
            loadingIndicator.style.display = 'none';
            calculateButton.disabled = false;
        });
}

// Function to append calculation to history table
function appendCalculationToHistory(calculation) {
    const historyTableBody = document.querySelector('#historyTable tbody');
    const row = document.createElement('tr');
    
    // Format timestamp
    let timestampText = 'Just now';
    if (calculation.timestamp && calculation.timestamp.toDate) {
        timestampText = calculation.timestamp.toDate().toLocaleString();
    }
    
    // Ticker Symbol
    const tickerSymbolText = calculation.tickerSymbol;
    
    // Average Sell Price
    const averageSellPriceText = calculation.averageSellPrice !== 'N/A' ? `$${calculation.averageSellPrice}` : 'N/A';
    
    // Type Indicator
    const typeText = calculation.isAggregate ? 'Aggregate' : 'Individual';
    
    row.innerHTML = `
        <td>${timestampText}</td>
        <td>${tickerSymbolText}</td>
        <td>${calculation.totalShares}</td>
        <td>${calculation.totalBuyPrice}</td>
        <td>${calculation.totalSellPrice}</td>
        <td>${calculation.totalProfitLoss}</td>
        <td>${calculation.averagePrice}</td>
        <td>${averageSellPriceText}</td>
        <td>${typeText}</td>
    `;
    
    // Optional: Style aggregate rows differently
    if (calculation.isAggregate) {
        row.classList.add('aggregate'); // Use CSS class
    }
    
    historyTableBody.prepend(row);
}

// Function to load calculation history from Firestore on page load
function loadCalculationHistory() {
    window.db.collection('calculations').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                appendCalculationToHistory(data);
            }
        });
    }, (error) => {
        console.error('Error fetching calculation history:', error);
    });
}

// Function to clear all input fields
function clearInputFields() {
    const investmentEntries = document.querySelectorAll('.investment-entry');
    investmentEntries.forEach((entry) => {
        entry.querySelector('input[name="investmentAmount"]').value = '';
        entry.querySelector('input[name="buyPrice"]').value = '';
        entry.querySelector('select[name="tickerSymbol"]').value = tickerSymbols[0]; // Reset to first ticker symbol
    });
    document.getElementById('sellPrice').value = '';
}

// Function to clear all calculation history
function clearCalculationHistory() {
    if (!confirm('Are you sure you want to clear all calculation history? This action cannot be undone.')) {
        return;
    }

    // Fetch all documents in the 'calculations' collection
    window.db.collection('calculations').get()
        .then((snapshot) => {
            const batch = window.db.batch();
            snapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            console.log('All calculation history cleared successfully!');
            // Clear the history table in the UI
            const historyTableBody = document.querySelector('#historyTable tbody');
            historyTableBody.innerHTML = '';
        })
        .catch((error) => {
            console.error('Error clearing calculation history:', error);
            alert('An error occurred while clearing the history. Please check the console for more details.');
        });
}

// Event Listener for Ticker Symbol Form Submission
document.getElementById('tickerForm').addEventListener('submit', addTickerSymbol);

// Event Listener for Adding Investment Entries
document.getElementById('addEntry').addEventListener('click', addInvestmentEntry);

// Event Listener for Calculate Button
document.getElementById('calculateButton').addEventListener('click', performCalculations);

// Event Listener for Clear History Button
document.getElementById('clearHistoryButton').addEventListener('click', clearCalculationHistory);

// Initial Rendering
renderTickerList();
populateTickerDropdowns();
loadCalculationHistory();

// Attach event listeners to existing remove buttons (if any)
document.querySelectorAll('.remove-entry').forEach(button => {
    button.addEventListener('click', () => {
        const entryDiv = button.parentElement;
        document.getElementById('investmentEntries').removeChild(entryDiv);
    });
});
