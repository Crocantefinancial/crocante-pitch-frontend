export const LOAN = {
    "data": {
        "typeId": "ETH_USDT",
        "operation": {
            "id": "389ae85b-7968-4086-b7e3-2b53dc4fe6ed",
            "creatorId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
            "ownerId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
            "openedAt": "2025-12-09T20:13:10.741629Z",
            "updatedAt": "2025-12-09T20:15:28.584195Z",
            "closedAt": "2025-12-09T20:15:28.584195Z",
            "status": "COMPLETED",
            "type": "LOAN",
            "fullType": "LOAN"
        },
        "sizeCurrencyId": "USDT",
        "collatCurrencyId": "ETH",
        "status": "REPAYED",
        "size": "12",
        "collat": "0",
        "repayed": "12.077298059884335989",
        "debt": "0",
        "interest": "0",
        "ratio": "0",
        "liqPrice": "0",
        "apr": "0.135",
        "tierNum": 0,
        "minCollat": "0",
        "initialAPR": "0.05",
        "initialRatio": "3.9999977462340143",
        "initialSize": "12",
        "initialCollat": "0.01435213",
        "initialDebt": "12.042",
        "origFee": "0.042",
        "tiers": [
            {
                "minRatio": "1.2",
                "minPrice": "0",
                "apr": "0.135"
            },
            {
                "minRatio": "1.5",
                "minPrice": "0",
                "apr": "0.0975"
            },
            {
                "minRatio": "2",
                "minPrice": "0",
                "apr": "0.05"
            }
        ],
        "lastUpdate": {
            "createdAt": "2025-12-09T20:15:28.584195Z",
            "type": "REPAY",
            "status": "REPAYED",
            "apr": "0.135",
            "dCollat": "-0.002379720642258472",
            "dRepayed": "1.992138092931196373",
            "liqCollat": "0",
            "price": "3354.995",
            "dFees": "0",
            "dTierNum": 0,
            "forcedLiq": false
        },
        "forcedLiq": false
    },
    "status": 200
}

export const LOAN_POST = {
    "data": {
        "typeId": "ETH_USDT",
        "operation": {
            "id": "2c7ce71e-8dc8-4dd2-97e1-3d9716a1874d",
            "creatorId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
            "ownerId": "79f970d7-3b2f-492c-a358-6c1f1c2fd429",
            "openedAt": "2026-01-29T14:44:45.257241494Z",
            "updatedAt": "2026-01-29T14:44:45.257241494Z",
            "closedAt": null,
            "status": "ACTIVE",
            "type": "LOAN",
            "fullType": "LOAN"
        },
        "sizeCurrencyId": "USDT",
        "collatCurrencyId": "ETH",
        "status": "ACTIVE",
        "size": "1",
        "collat": "0.00051709",
        "repayed": "0",
        "debt": "1.01",
        "interest": "0",
        "ratio": "1.4999964170901844",
        "liqPrice": "2328.8015625906515307",
        "apr": "0.135",
        "tierNum": 0,
        "minCollat": "0.0005170912351275",
        "initialAPR": "0.135",
        "initialRatio": "1.4999964170901844",
        "initialSize": "1",
        "initialCollat": "0.00051709",
        "initialDebt": "1.0035",
        "origFee": "0.0035",
        "tiers": [
            {
                "minRatio": "1.2",
                "minPrice": "2328.8015625906515307",
                "apr": "0.135"
            },
            {
                "minRatio": "1.5",
                "minPrice": "2911.0019532383144134",
                "apr": "0.0975"
            },
            {
                "minRatio": "2",
                "minPrice": "3881.3359376510858845",
                "apr": "0.05"
            }
        ],
        "lastUpdate": {
            "createdAt": "2026-01-29T14:44:45.257241494Z",
            "type": "CREATE",
            "status": "ACTIVE",
            "apr": "0.135",
            "dCollat": "0.00051709",
            "dRepayed": "0",
            "liqCollat": "0",
            "price": "2910.995",
            "dFees": "0.0035",
            "dTierNum": 0,
            "forcedLiq": false
        },
        "forcedLiq": false
    },
    "status": 200
}