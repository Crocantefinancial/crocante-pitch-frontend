export const LOANS_ACTIVITY = {
    "data": [
        {
            "typeId": "ETH_USDT",
            "operation": {
                "id": "ea3a6edf-dae1-4bef-8632-e71f20eed5d8",
                "creatorId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
                "ownerId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
                "openedAt": "2025-11-25T12:11:53.505737Z",
                "updatedAt": "2025-11-27T17:56:04.456209Z",
                "closedAt": "2025-12-09T20:15:28.584195Z",
                "status": "ACTIVE",
                "type": "LOAN",
                "fullType": "LOAN"
            },
            "sizeCurrencyId": "USDT",
            "collatCurrencyId": "ETH",
            "status": "ACTIVE",
            "size": "10",
            "collat": "0.02384469",
            "repayed": "0",
            "debt": "10.13",
            "interest": "0.09",
            "ratio": "6.869691212327997",
            "liqPrice": "509.4560864277897846",
            "apr": "0.05",
            "tierNum": 2,
            "minCollat": "0.00520649820996525",
            "initialAPR": "0.05",
            "initialRatio": "3.9999979013901345",
            "initialSize": "10",
            "initialCollat": "0.01384469",
            "initialDebt": "10.035",
            "origFee": "0.035",
            "tiers": [
                {
                    "minRatio": "1.2",
                    "minPrice": "509.4560864277897846",
                    "apr": "0.135"
                },
                {
                    "minRatio": "1.5",
                    "minPrice": "636.8201080347372308",
                    "apr": "0.0975"
                },
                {
                    "minRatio": "2",
                    "minPrice": "849.0934773796496411",
                    "apr": "0.05"
                }
            ],
            "lastUpdate": {
                "createdAt": "2025-11-27T17:56:04.456209Z",
                "type": "ADD_COLLAT",
                "status": "ACTIVE",
                "apr": "0.05",
                "dCollat": "0.01",
                "dRepayed": "0",
                "liqCollat": "0",
                "price": "3019.845",
                "dFees": "0",
                "dTierNum": 0,
                "forcedLiq": false
            },
            "forcedLiq": false
        }
    ],
    "status": 200
}