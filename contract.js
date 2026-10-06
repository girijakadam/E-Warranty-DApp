const contractAddress = "0x9798c61e182eA124cdAe8f0205436308d2295B5A";

const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "warrantyId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "productName",
                "type": "string"
            }
        ],
        "name": "WarrantyIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "warrantyId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "revokedBy",
                "type": "address"
            }
        ],
        "name": "WarrantyRevoked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "warrantyId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "WarrantyTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            }
        ],
        "name": "addManufacturer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "authorizedManufacturers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_warrantyId",
                "type": "uint256"
            }
        ],
        "name": "generateWarrantyHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_warrantyId",
                "type": "uint256"
            }
        ],
        "name": "getWarrantyStatus",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_productName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_serialNumber",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_durationInDays",
                "type": "uint256"
            }
        ],
        "name": "issueWarranty",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextWarrantyId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            }
        ],
        "name": "removeManufacturer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_warrantyId",
                "type": "uint256"
            }
        ],
        "name": "revokeWarranty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_warrantyId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_newOwner",
                "type": "address"
            }
        ],
        "name": "transferWarranty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_warrantyId",
                "type": "uint256"
            }
        ],
        "name": "verifyWarranty",
        "outputs": [
            {
                "internalType": "bool",
                "name": "authentic",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "expired",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "revoked",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "warranties",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "warrantyId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "productName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "serialNumber",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "manufacturer",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "issueDate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "expiryDate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isRevoked",
                "type": "bool"
            },
            {
                "internalType": "bytes32",
                "name": "dataHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];