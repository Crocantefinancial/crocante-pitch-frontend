export const LOAN_TYPE = {
    "data": [
        {
            "id": "BTC_USDT",
            "groupId": "TRADE",
            "collatId": "BTC",
            "sizeId": "USDT",
            "durationDays": 180,
            "tiers": [
                {
                    "ratio": "1.2",
                    "apr": "0.135"
                },
                {
                    "ratio": "1.5",
                    "apr": "0.0975"
                },
                {
                    "ratio": "2",
                    "apr": "0.05"
                }
            ],
            "models": [
                {
                    "ratio": "4",
                    "apr": "0.05"
                },
                {
                    "ratio": "2",
                    "apr": "0.0975"
                },
                {
                    "ratio": "1.5",
                    "apr": "0.135"
                }
            ],
            "liqRatio": "1.2",
            "forcedLiqFeePercent": "0.005",
            "liqFeePercent": "0.0035",
            "origFeePercent": "0.0035",
            "minCollatRatio": "1.5",
            "marginCallRatio": "1.3",
            "minSize": "0",
            "maxSize": "500000",
            "minLiqAmount": "10",
            "maxLiqAmount": "950000"
        },
        {
            "id": "ETH_USDT",
            "groupId": "TRADE",
            "collatId": "ETH",
            "sizeId": "USDT",
            "durationDays": 180,
            "tiers": [
                {
                    "ratio": "1.2",
                    "apr": "0.135"
                },
                {
                    "ratio": "1.5",
                    "apr": "0.0975"
                },
                {
                    "ratio": "2",
                    "apr": "0.05"
                }
            ],
            "models": [
                {
                    "ratio": "4",
                    "apr": "0.05"
                },
                {
                    "ratio": "2",
                    "apr": "0.0975"
                },
                {
                    "ratio": "1.5",
                    "apr": "0.135"
                }
            ],
            "liqRatio": "1.2",
            "forcedLiqFeePercent": "0.005",
            "liqFeePercent": "0.0035",
            "origFeePercent": "0.0035",
            "minCollatRatio": "1.5",
            "marginCallRatio": "1.3",
            "minSize": "0",
            "maxSize": "500000",
            "minLiqAmount": "10",
            "maxLiqAmount": "950000"
        }
    ],
    "status": 200
}