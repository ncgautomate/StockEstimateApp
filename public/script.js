// script.js

console.log('script.js loaded');

// Initialize ticker symbols with default 'DOGE'
let tickerSymbols = ['DOGE'];

// Function to generate a unique calculation ID
function generateCalculationId() {
    return 'calc_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

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
    
    // Generate a unique calculation ID
    const calculationId = generateCalculationId();
    
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
        
        const totalProfitLossElem = document.getElementById('totalProfitLoss');
        const averageSellPriceElem = document.getElementById('averageSellPrice');
        
        if (sellPrice > 0) {
            document.getElementById('totalSellPrice').innerText = `Total Sell Price: $${totalSellPrice.toFixed(2)}`;
            document.getElementById('totalProfitLoss').innerText = `Total Profit/Loss: $${totalProfitLoss.toFixed(2)}`;
            document.getElementById('averageSellPrice').innerText = `Average Sell Price per Share: $${averageSellPrice.toFixed(4)}`;
            
            // Apply classes based on profit or loss
            if (totalProfitLoss > 0) {
                totalProfitLossElem.classList.add('profit');
                totalProfitLossElem.classList.remove('loss');
            } else if (totalProfitLoss < 0) {
                totalProfitLossElem.classList.add('loss');
                totalProfitLossElem.classList.remove('profit');
            } else {
                totalProfitLossElem.classList.remove('profit', 'loss');
            }
            
            // Similarly, handle average sell price if needed
            if (averageSellPrice > averagePrice) { // Assuming average sell price > average buy price indicates profit
                averageSellPriceElem.classList.add('profit');
                averageSellPriceElem.classList.remove('loss');
            } else if (averageSellPrice < averagePrice) {
                averageSellPriceElem.classList.add('loss');
                averageSellPriceElem.classList.remove('profit');
            } else {
                averageSellPriceElem.classList.remove('profit', 'loss');
            }
            
        } else {
            document.getElementById('totalSellPrice').innerText = '';
            document.getElementById('totalProfitLoss').innerText = '';
            document.getElementById('averageSellPrice').innerText = '';
            totalProfitLossElem.classList.remove('profit', 'loss');
            averageSellPriceElem.classList.remove('profit', 'loss');
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
            isAggregate: false, // Flag to indicate individual calculation
            calculationId: calculationId // Add calculationId
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
        isAggregate: true, // Flag to indicate aggregate calculation
        calculationId: calculationId // Add the same calculationId
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
const calculationsMap = new Map();

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
    
    // Assign calculationId as a data attribute
    row.setAttribute('data-calculation-id', calculation.calculationId);
    
    // Optional: Style aggregate rows differently
    if (calculation.isAggregate) {
        row.classList.add('aggregate'); // Use CSS class for styling
        // Attach click event listener to aggregate row
        row.addEventListener('click', handleRowClick);
        row.style.cursor = 'pointer'; // Change cursor to pointer on hover
    }
    
    // Apply profit/loss styling to the "Total Profit/Loss" cell (6th column, index 5)
    const profitLossCell = row.children[5];
    
    if (calculation.totalProfitLoss !== 'N/A') {
        const profitLossValue = parseFloat(calculation.totalProfitLoss);
        if (profitLossValue > 0) {
            profitLossCell.classList.add('profit');
            profitLossCell.classList.remove('loss');
        } else if (profitLossValue < 0) {
            profitLossCell.classList.add('loss');
            profitLossCell.classList.remove('profit');
        } else {
            profitLossCell.classList.remove('profit', 'loss');
        }
    } else {
        profitLossCell.classList.remove('profit', 'loss');
    }
    
    // Group entries by calculationId
    if (!calculationsMap.has(calculation.calculationId)) {
        calculationsMap.set(calculation.calculationId, []);
    }
    calculationsMap.get(calculation.calculationId).push(row);
    
    // If the entry is Aggregate, append all related entries together
    if (calculation.isAggregate) {
        const relatedRows = calculationsMap.get(calculation.calculationId);
        relatedRows.forEach(r => historyTableBody.prepend(r));
    } else {
        // For Individual entries, they will be appended after the Aggregate entry
        // No action needed as Aggregate entry handles their display
    }
}

// Function to handle clicking on a row
function handleRowClick(event) {
    const row = event.currentTarget;
    const calculationId = row.getAttribute('data-calculation-id');
    
    if (!calculationId) return;
    
    // Fetch all entries with this calculationId from Firestore
    window.db.collection('calculations').where('calculationId', '==', calculationId).get()
        .then((snapshot) => {
            const entries = [];
            let aggregateData = null;
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.isAggregate) {
                    aggregateData = data;
                } else {
                    entries.push(data);
                }
            });
            
            if (aggregateData && entries.length > 0) {
                populateCalculationForm(entries, aggregateData);
            } else {
                alert('Unable to retrieve related entries for this calculation.');
            }
        })
        .catch((error) => {
            console.error('Error fetching related entries:', error);
            alert('An error occurred while fetching the related entries.');
        });
}

// Function to populate the calculation form with retrieved data
function populateCalculationForm(entries, aggregateData) {
    // Clear existing investment entries
    const investmentEntriesDiv = document.getElementById('investmentEntries');
    investmentEntriesDiv.innerHTML = '';
    
    // Populate each individual entry
    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('investment-entry');
        entryDiv.innerHTML = `
            <label>Investment Amount ($):</label>
            <input type="number" name="investmentAmount" placeholder="Enter investment amount" required value="${entry.totalBuyPrice}">
            
            <label>Buy Price per Share ($):</label>
            <input type="number" name="buyPrice" placeholder="Enter buy price per share" step="0.0001" required value="${entry.averagePrice}">
            
            <label>Ticker Symbol:</label>
            <select name="tickerSymbol" class="tickerSelect" required>
                <!-- Options will be populated dynamically -->
            </select>
            
            <button type="button" class="remove-entry">Remove</button>
        `;
        investmentEntriesDiv.appendChild(entryDiv);
        
        // Populate the ticker dropdown
        const tickerSelect = entryDiv.querySelector('.tickerSelect');
        tickerSymbols.forEach(symbol => {
            const option = document.createElement('option');
            option.value = symbol;
            option.textContent = symbol;
            if (symbol === entry.tickerSymbol) {
                option.selected = true;
            }
            tickerSelect.appendChild(option);
        });
        
        // Attach event listener to the new remove button
        entryDiv.querySelector('.remove-entry').addEventListener('click', () => {
            investmentEntriesDiv.removeChild(entryDiv);
        });
    });
    
    // Populate the sell price
    const sellPriceInput = document.getElementById('sellPrice');
    if (aggregateData.averageSellPrice !== 'N/A') {
        sellPriceInput.value = parseFloat(aggregateData.averageSellPrice).toFixed(4);
    } else {
        sellPriceInput.value = '';
    }
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
            // Clear the calculationsMap
            calculationsMap.clear();
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
