"""
Smart Retail System - Python FastAPI Analytics Microservice
Author: Senior AI/ML Engineer
Listens for analytical requests from the Spring Boot Backend.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import pandas as pd
from eda import perform_inventory_eda, compute_category_aggregates
from prediction import forecast_inventory_depletion, batch_predict_store_inventory

app = FastAPI(
    title="Smart Retail AI Analytics & EDA Service",
    description="Edge AI & Exploratory Data Analysis Engine for Inventory & Queue Optimization",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InventoryPayload(BaseModel):
    products: List[Dict[str, Any]]
    store_id: Optional[str] = "STORE-01"

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "Smart Retail Analytics Engine",
        "dependencies": ["pandas", "numpy", "scikit-learn", "seaborn", "fastapi"]
    }

@app.post("/api/analytics/eda")
def run_eda(payload: InventoryPayload):
    try:
        df = pd.DataFrame(payload.products)
        eda_results = perform_inventory_eda(df)
        category_summary = compute_category_aggregates(df)
        return {
            "status": "SUCCESS",
            "eda": eda_results,
            "category_aggregates": category_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"EDA processing error: {str(e)}")

@app.post("/api/analytics/predictions")
def run_predictions(payload: InventoryPayload):
    try:
        predictions = batch_predict_store_inventory(payload.products)
        return {
            "status": "SUCCESS",
            "total_items_analyzed": len(payload.products),
            "predictions": predictions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
