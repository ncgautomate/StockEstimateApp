// script.js - Lightweight Stock Investment Calculator

console.log('Stock Investment Calculator loaded');

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
    
    // Save to localStorage
    saveTickerSymbolsToLocalStorage();
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
    
    // Save to localStorage
    saveTickerSymbolsToLocalStorage();
}

// Function to save ticker symbols to localStorage
function saveTickerSymbolsToLocalStorage() {
    try {
        localStorage.setItem('stockCalculatorTickers', JSON.stringify(tickerSymbols));
    } catch (error) {
        console.warn('Could not save ticker symbols to localStorage:', error);
    }
}

// Function to load ticker symbols from localStorage
function loadTickerSymbolsFromLocalStorage() {
    try {
        const saved = localStorage.getItem('stockCalculatorTickers');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                tickerSymbols = parsed;
            }
        }
    } catch (error) {
        console.warn('Could not load ticker symbols from localStorage:', error);
    }
}

// Function to attach event listeners for auto-calculation to an investment entry
function attachEventListeners(entryDiv) {
    const buyPriceInput = entryDiv.querySelector('input[name="buyPrice"]');
    const totalSharesInput = entryDiv.querySelector('input[name="totalShares"]');
    const investmentAmountInput = entryDiv.querySelector('input[name="investmentAmount"]');
    const sellPriceInput = entryDiv.querySelector('input[name="sellPrice"]');

    // Flag to prevent infinite loops
    let isUpdating = false;

    // Listener for Buy Price input to update Investment Amount based on Total Shares
    buyPriceInput.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;
        const buyPrice = parseFloat(buyPriceInput.value);
        const totalShares = parseFloat(totalSharesInput.value);
        if (!isNaN(buyPrice) && buyPrice > 0 && !isNaN(totalShares)) {
            const investmentAmount = buyPrice * totalShares;
            investmentAmountInput.value = investmentAmount.toFixed(2);
        } else {
            investmentAmountInput.value = '';
        }
        isUpdating = false;
    });

    // Listener for Total Shares input to calculate Investment Amount
    totalSharesInput.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;
        const totalShares = parseFloat(totalSharesInput.value);
        const buyPrice = parseFloat(buyPriceInput.value);
        if (!isNaN(totalShares) && !isNaN(buyPrice) && buyPrice > 0) {
            const investmentAmount = totalShares * buyPrice;
            investmentAmountInput.value = investmentAmount.toFixed(2);
        } else {
            investmentAmountInput.value = '';
        }
        isUpdating = false;
    });

    // Listener for Investment Amount input to calculate Total Shares
    investmentAmountInput.addEventListener('input', () => {
        if (isUpdating) return;
        isUpdating = true;
        const investmentAmount = parseFloat(investmentAmountInput.value);
        const buyPrice = parseFloat(buyPriceInput.value);
        if (!isNaN(investmentAmount) && !isNaN(buyPrice) && buyPrice > 0) {
            const totalShares = investmentAmount / buyPrice;
            totalSharesInput.value = totalShares.toFixed(2);
        } else {
            totalSharesInput.value = '';
        }
        isUpdating = false;
    });
}

// Function to add a new investment entry
function addInvestmentEntry() {
    const investmentEntries = document.getElementById('investmentEntries');
    const entryDiv = document.createElement('div');
    entryDiv.classList.add('investment-entry');
    entryDiv.innerHTML = `
        <label>Buy Price per Share ($):</label>
        <input type="number" name="buyPrice" placeholder="Enter buy price per share" step="0.0001" required data-buy-price>
        
        <label>Total Shares:</label>
        <input type="number" name="totalShares" placeholder="Enter total shares" min="0" step="0.01" data-total-shares>
        
        <label>Investment Amount ($):</label>
        <input type="number" name="investmentAmount" placeholder="Enter investment amount" min="0" step="0.01" data-investment-amount>
        
        <label>Ticker Symbol:</label>
        <select name="tickerSymbol" class="tickerSelect" required>
            <!-- Options will be populated dynamically -->
        </select>
        
        <label>Sell Price per Share ($):</label>
        <input type="number" name="sellPrice" placeholder="Enter sell price per share (optional)" step="0.0001" min="0" data-sell-price>
        
        <button type="button" class="remove-entry">Remove</button>
    `;
    investmentEntries.appendChild(entryDiv);

    // Populate the new dropdown
    populateTickerDropdowns();

    // Attach event listeners for interdependent fields
    attachEventListeners(entryDiv);

    // Attach event listener to the new remove button
    entryDiv.querySelector('.remove-entry').addEventListener('click', () => {
        investmentEntries.removeChild(entryDiv);
    });
}

// Function to perform calculations
function performCalculations() {
    console.log('performCalculations called');
    const investmentForm = document.getElementById('investmentForm');
    const entries = investmentForm.querySelectorAll('.investment-entry');
    const calculateButton = document.getElementById('calculateButton');
    const loadingIndicator = document.getElementById('loading');

    // Show loading indicator and disable calculate button
    loadingIndicator.style.display = 'flex';
    calculateButton.disabled = true;

    // Add a small delay to show the loading indicator
    setTimeout(() => {
        try {
            calculateInvestments(entries);
        } finally {
            // Hide loading indicator and enable calculate button
            loadingIndicator.style.display = 'none';
            calculateButton.disabled = false;
        }
    }, 100);
}

// Function to calculate investments (separated for clarity)
function calculateInvestments(entries) {
    let totalInvestment = 0;
    let totalShares = 0;
    let totalSellPrice = 0;
    let totalProfitLoss = 0;

    // Validate all entries before proceeding
    for (let entry of entries) {
        const buyPriceInput = entry.querySelector('input[name="buyPrice"]');
        const totalSharesInput = entry.querySelector('input[name="totalShares"]');
        const investmentAmountInput = entry.querySelector('input[name="investmentAmount"]');
        const tickerSymbolSelect = entry.querySelector('select[name="tickerSymbol"]');
        const sellPriceInput = entry.querySelector('input[name="sellPrice"]');

        const buyPrice = parseFloat(buyPriceInput.value);
        const totalSharesValue = parseFloat(totalSharesInput.value);
        const investmentAmount = parseFloat(investmentAmountInput.value);
        const tickerSymbol = tickerSymbolSelect.value.trim().toUpperCase();
        const sellPrice = parseFloat(sellPriceInput.value) || 0; // Default to 0 if not provided

        console.log(`Buy Price: ${buyPrice}, Total Shares: ${totalSharesValue}, Investment Amount: ${investmentAmount}, Ticker Symbol: ${tickerSymbol}, Sell Price: ${sellPrice}`);

        if (
            isNaN(buyPrice) || buyPrice <= 0 ||
            (isNaN(totalSharesValue) && isNaN(investmentAmount)) ||
            tickerSymbol === ''
        ) {
            alert('Please ensure all fields are filled with valid numbers and a ticker symbol is selected.');
            console.error('Invalid input detected. Aborting calculations.');
            return;
        }

        let calculatedTotalShares = 0;
        let calculatedInvestmentAmount = 0;

        if (!isNaN(totalSharesValue) && !isNaN(investmentAmount)) {
            // Both fields are filled; verify consistency
            const expectedInvestment = totalSharesValue * buyPrice;
            const difference = Math.abs(expectedInvestment - investmentAmount);
            if (difference > 0.01) { // Allow minor discrepancies
                alert('Investment Amount does not match Total Shares multiplied by Buy Price. Please check your inputs.');
                console.error('Inconsistent Total Shares and Investment Amount.');
                return;
            }
            calculatedTotalShares = totalSharesValue;
            calculatedInvestmentAmount = investmentAmount;
        } else if (!isNaN(totalSharesValue)) {
            // Only Total Shares is filled; calculate Investment Amount
            calculatedTotalShares = totalSharesValue;
            calculatedInvestmentAmount = totalSharesValue * buyPrice;
            investmentAmountInput.value = calculatedInvestmentAmount.toFixed(2);
        } else if (!isNaN(investmentAmount)) {
            // Only Investment Amount is filled; calculate Total Shares
            calculatedInvestmentAmount = investmentAmount;
            calculatedTotalShares = investmentAmount / buyPrice;
            totalSharesInput.value = calculatedTotalShares.toFixed(2);
        }

        totalShares += calculatedTotalShares;
        totalInvestment += calculatedInvestmentAmount;

        // Calculate sell-related totals
        const sellTotal = sellPrice > 0 ? calculatedTotalShares * sellPrice : 0;
        const profitLoss = sellPrice > 0 ? sellTotal - calculatedInvestmentAmount : 0;

        totalSellPrice += sellTotal;
        totalProfitLoss += profitLoss;
    }

    console.log(`Total Investment: ${totalInvestment}, Total Shares: ${totalShares}, Total Sell Price: ${totalSellPrice}, Total Profit/Loss: ${totalProfitLoss}`);

    // Calculate average prices
    const averagePrice = totalInvestment / totalShares;
    const averageSellPrice = totalSellPrice > 0 ? totalSellPrice / totalShares : 0;

    console.log(`Average Price per Share: ${averagePrice}`);
    console.log(`Average Sell Price per Share: ${averageSellPrice}`);

    // Display results
    displayResults(totalShares, totalInvestment, totalSellPrice, totalProfitLoss, averagePrice, averageSellPrice);
}

// Function to display calculation results
function displayResults(totalShares, totalInvestment, totalSellPrice, totalProfitLoss, averagePrice, averageSellPrice) {
    try {
        document.getElementById('totalShares').innerText = `Total Shares: ${totalShares.toFixed(2)}`;
        document.getElementById('totalInvestment').innerText = `Total Investment: $${totalInvestment.toFixed(2)}`;

        const totalProfitLossElem = document.getElementById('totalProfitLoss');
        const averageSellPriceElem = document.getElementById('averageSellPrice');

        if (totalSellPrice > 0) {
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

            // Handle average sell price styling
            if (averageSellPrice > averagePrice) {
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
}

// Function to clear all input fields
function clearInputFields() {
    const investmentEntries = document.querySelectorAll('.investment-entry');
    investmentEntries.forEach((entry) => {
        const buyPriceInput = entry.querySelector('input[name="buyPrice"]');
        const totalSharesInput = entry.querySelector('input[name="totalShares"]');
        const investmentAmountInput = entry.querySelector('input[name="investmentAmount"]');
        const tickerSymbolSelect = entry.querySelector('select[name="tickerSymbol"]');
        const sellPriceInput = entry.querySelector('input[name="sellPrice"]');

        buyPriceInput.value = '';
        totalSharesInput.value = '';
        investmentAmountInput.value = '';
        tickerSymbolSelect.value = tickerSymbols[0]; // Reset to first ticker symbol
        sellPriceInput.value = '';
    });
    
    // Clear results as well
    clearResults();
}

// Function to clear results display
function clearResults() {
    document.getElementById('totalShares').innerText = '';
    document.getElementById('totalInvestment').innerText = '';
    document.getElementById('totalBuyPrice').innerText = '';
    document.getElementById('totalSellPrice').innerText = '';
    document.getElementById('totalProfitLoss').innerText = '';
    document.getElementById('averagePrice').innerText = '';
    document.getElementById('averageSellPrice').innerText = '';
}

// Function to initialize event listeners for all existing investment entries on page load
function initializeInvestmentEntries() {
    const existingEntries = document.querySelectorAll('.investment-entry');
    existingEntries.forEach(entry => {
        attachEventListeners(entry);
    });
}

// Function to initialize the application
function initializeApp() {
    // Load ticker symbols from localStorage
    loadTickerSymbolsFromLocalStorage();
    
    // Initial Rendering
    renderTickerList();
    populateTickerDropdowns();
    initializeInvestmentEntries();
    
    console.log('Stock Investment Calculator initialized');
}

// Event Listener for Ticker Symbol Form Submission
document.getElementById('tickerForm').addEventListener('submit', addTickerSymbol);

// Event Listener for Adding Investment Entries
document.getElementById('addEntry').addEventListener('click', addInvestmentEntry);

// Event Listener for Calculate Button
document.getElementById('calculateButton').addEventListener('click', performCalculations);

// Attach event listeners to existing remove buttons (if any)
document.querySelectorAll('.remove-entry').forEach(button => {
    button.addEventListener('click', () => {
        const entryDiv = button.parentElement;
        document.getElementById('investmentEntries').removeChild(entryDiv);
    });
});

// Add a "Clear Form" button functionality
function addClearFormButton() {
    const calculateButton = document.getElementById('calculateButton');
    const clearButton = document.createElement('button');
    clearButton.id = 'clearButton';
    clearButton.textContent = 'Clear Form';
    clearButton.type = 'button';
    clearButton.addEventListener('click', clearInputFields);
    
    // Insert the clear button after the calculate button
    calculateButton.parentNode.insertBefore(clearButton, calculateButton.nextSibling);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    addClearFormButton();
});