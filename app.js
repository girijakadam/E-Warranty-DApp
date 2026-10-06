let provider;
let signer;
let userAddress;
let contract;


// ======================================================
// CONNECT METAMASK
// ======================================================

document.getElementById("connectWallet").addEventListener("click", async () => {

    try {

        // Check whether MetaMask exists
        if (!window.ethereum) {
            alert("Please install MetaMask first.");
            return;
        }

        // Create provider
        provider = new ethers.BrowserProvider(window.ethereum);

        // Request wallet connection
        await provider.send("eth_requestAccounts", []);

        // Get signer
        signer = await provider.getSigner();

        // Get wallet address
        userAddress = await signer.getAddress();

        // Connect to smart contract
        contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        // Display wallet address
        document.getElementById("walletAddress").innerText =
            "Connected Wallet: " + userAddress;

        console.log("Wallet connected:", userAddress);
        console.log("Smart contract connected:", contract);

    } catch (error) {

        console.error(error);

        alert("Wallet connection failed.");

    }

});


// ======================================================
// ISSUE WARRANTY
// ======================================================

document.getElementById("issueWarranty").addEventListener("click", async () => {

    try {

        // Check wallet connection
        if (!contract || !signer) {
            alert("Please connect your wallet first.");
            return;
        }

        // Get form values
        const productId = document.getElementById("productId").value;
        const productName = document.getElementById("productName").value;
        const customerAddress = document.getElementById("customerAddress").value;
        const warrantyPeriod = document.getElementById("warrantyPeriod").value;

        // Validate fields
        if (!productId || !productName || !customerAddress || !warrantyPeriod) {
            alert("Please fill all fields.");
            return;
        }

        // Check wallet address
        if (!ethers.isAddress(customerAddress)) {
            alert("Please enter a valid customer wallet address.");
            return;
        }

        console.log("Issuing warranty...");

        // Call smart contract
        const transaction = await contract.issueWarranty(
            productName,
            productId,
            customerAddress,
            warrantyPeriod
        );

        console.log("Transaction sent:", transaction.hash);

        alert("Transaction submitted. Please confirm it in MetaMask.");

        // Wait for blockchain confirmation
        const receipt = await transaction.wait();

        console.log("Transaction confirmed:", receipt);

        alert("Warranty issued successfully!");

    } catch (error) {

        console.error("Issue Warranty Error:", error);

        alert("Failed to issue warranty. Check the console for details.");

    }

});


// ======================================================
// FIND WARRANTY BY PRODUCT ID / SERIAL NUMBER
// ======================================================

document.getElementById("findWarranty").addEventListener("click", async () => {

    try {

        // Check wallet connection
        if (!contract) {
            alert("Please connect your wallet first.");
            return;
        }

        // Get search value
        const searchValue = document
            .getElementById("searchProductId")
            .value
            .trim();

        // Validate search value
        if (!searchValue) {
            alert("Please enter Product ID or Serial Number.");
            return;
        }

        console.log("Searching warranty for:", searchValue);

        // Get next warranty ID
        const nextId = await contract.nextWarrantyId();

        console.log("Next Warranty ID:", nextId.toString());

        let foundWarranty = null;

        // Search all existing warranties
        for (let id = 1; id < Number(nextId); id++) {

            try {

                console.log("Checking Warranty ID:", id);

                const warranty = await contract.warranties(id);

                // In the smart contract,
                // Product ID is stored as serialNumber
                const serialNumber = warranty.serialNumber;

                if (
                    serialNumber.toLowerCase() ===
                    searchValue.toLowerCase()
                ) {

                    foundWarranty = {
                        id: id,
                        warranty: warranty
                    };

                    break;
                }

            } catch (error) {

                console.error(
                    `Error reading warranty ${id}:`,
                    error
                );

            }

        }

        // ==================================================
        // WARRANTY NOT FOUND
        // ==================================================

        if (!foundWarranty) {

            document.getElementById("warrantyResult").innerHTML = `
                <div>
                    <h3>❌ Warranty Not Found</h3>
                    <p>
                        No warranty was found for:
                        <strong>${searchValue}</strong>
                    </p>
                </div>
            `;

            // Clear Warranty ID
            document.getElementById("verifyWarrantyId").value = "";

            return;
        }


        // ==================================================
        // WARRANTY FOUND
        // ==================================================

        const warranty = foundWarranty.warranty;

        // Automatically fill Warranty ID
        document.getElementById("verifyWarrantyId").value =
            foundWarranty.id;


        // Display warranty information
        document.getElementById("warrantyResult").innerHTML = `
            <div>
                <h3>✅ Warranty Found</h3>

                <p>
                    <strong>Warranty ID:</strong>
                    ${foundWarranty.id}
                </p>

                <p>
                    <strong>Product:</strong>
                    ${warranty.productName}
                </p>

                <p>
                    <strong>Product ID / Serial Number:</strong>
                    ${warranty.serialNumber}
                </p>

                <p>
                    <strong>Manufacturer:</strong>
                    ${warranty.manufacturer}
                </p>

                <p>
                    <strong>Owner:</strong>
                    ${warranty.owner}
                </p>
            </div>
        `;

        console.log("Warranty found:", foundWarranty);

    } catch (error) {

        console.error("Find Warranty Error:", error);

        alert("Failed to search warranty. Check the browser console.");

    }

});


// ======================================================
// VERIFY WARRANTY
// ======================================================

document.getElementById("verifyWarranty").addEventListener("click", async () => {

    try {

        const warrantyId = document
            .getElementById("verifyWarrantyId")
            .value
            .trim();

        if (!warrantyId) {
            alert("Please enter Warranty ID");
            return;
        }

        if (!contract) {
            alert("Please connect your wallet first.");
            return;
        }

        console.log("Verifying warranty:", warrantyId);

        // Get verification status
        const result = await contract.verifyWarranty(warrantyId);

        const [
            authentic,
            active,
            expired,
            revoked
        ] = result;

        // Get complete warranty information
        const warranty = await contract.warranties(warrantyId);

        console.log("Warranty details:", warranty);

        // Warranty data from smart contract
        const productName = warranty.productName;
        const serialNumber = warranty.serialNumber;
        const manufacturer = warranty.manufacturer;
        const owner = warranty.owner;

        const issueDate = new Date(
            Number(warranty.issueDate) * 1000
        ).toLocaleDateString();

        const expiryDate = new Date(
            Number(warranty.expiryDate) * 1000
        ).toLocaleDateString();

        let status;

        if (!authentic) {

            status = "❌ Warranty does not exist";

        } else if (revoked) {

            status = "⚠️ Warranty is revoked";

        } else if (expired) {

            status = "⚠️ Warranty has expired";

        } else if (active) {

            status = "✅ Warranty is authentic and active";

        } else {

            status = "Warranty is authentic but inactive";

        }


        // Display warranty details
        alert(
            `Warranty Details\n\n` +
            `Warranty ID: ${warrantyId}\n` +
            `Product: ${productName}\n` +
            `Product ID / Serial Number: ${serialNumber}\n` +
            `Manufacturer: ${manufacturer}\n` +
            `Owner: ${owner}\n` +
            `Issue Date: ${issueDate}\n` +
            `Expiry Date: ${expiryDate}\n\n` +
            `Status: ${status}`
        );


        console.log("Verification result:", {

            authentic,
            active,
            expired,
            revoked

        });

    } catch (error) {

        console.error(
            "Verify Warranty Error:",
            error
        );

        alert(
            "Failed to verify warranty. Check the browser console."
        );

    }

});


// ======================================================
// TRANSFER WARRANTY
// ======================================================

document.getElementById("transferWarranty").addEventListener("click", async () => {

    try {

        // Check wallet connection
        if (!contract || !signer) {
            alert("Please connect your wallet first.");
            return;
        }

        // Get form values
        const warrantyId = document
            .getElementById("transferWarrantyId")
            .value
            .trim();

        const newOwner = document
            .getElementById("newOwner")
            .value
            .trim();

        // Validate fields
        if (!warrantyId || !newOwner) {
            alert(
                "Please enter Warranty ID and New Owner address."
            );
            return;
        }

        // Validate wallet address
        if (!ethers.isAddress(newOwner)) {
            alert("Please enter a valid wallet address.");
            return;
        }

        console.log(
            "Transferring warranty:",
            warrantyId
        );

        console.log(
            "New owner:",
            newOwner
        );

        // Call smart contract
        const transaction = await contract.transferWarranty(
            warrantyId,
            newOwner
        );

        console.log(
            "Transaction sent:",
            transaction.hash
        );

        alert(
            "Transfer transaction submitted. Please confirm it in MetaMask."
        );

        // Wait for blockchain confirmation
        const receipt = await transaction.wait();

        console.log(
            "Transfer confirmed:",
            receipt
        );

        alert(
            "Warranty transferred successfully!"
        );

    } catch (error) {

        console.error(
            "Transfer Warranty Error:",
            error
        );

        alert(
            "Failed to transfer warranty. Check the browser console."
        );

    }

});