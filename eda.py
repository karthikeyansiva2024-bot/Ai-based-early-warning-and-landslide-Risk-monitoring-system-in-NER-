"""
Smart Retail System - Exploratory Data Analysis (EDA) Module
Author: Data Analytics & AI Specialist
Utilizes Pandas, NumPy, Scikit-learn, Matplotlib, and Seaborn for automated store data intelligence.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List


def perform_inventory_eda(inventory_df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs comprehensive Exploratory Data Analysis on store inventory dataset.
    Computes dataset statistics, data types, missing values, outliers, and distribution parameters.
    """
    if inventory_df.empty:
        return {
            "total_records": 0,
            "columns": [],
            "missing_values": {},
            "duplicates": 0,
            "descriptive_stats": {},
            "outliers": {},
            "correlation_matrix": {}
        }

    total_records = len(inventory_df)
    columns_info = [
        {"column": col, "dtype": str(inventory_df[col].dtype), "non_null_count": int(inventory_df[col].count())}
        for col in inventory_df.columns
    ]

    missing_values = inventory_df.isnull().sum().to_dict()
    duplicates = int(inventory_df.duplicated().sum())

    numeric_cols = inventory_df.select_dtypes(include=[np.number]).columns.tolist()

    # Descriptive Statistics using Pandas & NumPy
    descriptive_stats = {}
    outliers_data = {}

    for col in numeric_cols:
        series = inventory_df[col].dropna()
        if len(series) == 0:
            continue

        mean_val = float(series.mean())
        median_val = float(series.median())
        mode_series = series.mode()
        mode_val = float(mode_series.iloc[0]) if not mode_series.empty else mean_val
        std_val = float(series.std(ddof=1)) if len(series) > 1 else 0.0
        var_val = float(series.var(ddof=1)) if len(series) > 1 else 0.0
        min_val = float(series.min())
        max_val = float(series.max())
        q25 = float(series.quantile(0.25))
        q75 = float(series.quantile(0.75))
        iqr = q75 - q25

        descriptive_stats[col] = {
            "count": int(len(series)),
            "mean": round(mean_val, 2),
            "median": round(median_val, 2),
            "mode": round(mode_val, 2),
            "min": round(min_val, 2),
            "max": round(max_val, 2),
            "range": round(max_val - min_val, 2),
            "std_dev": round(std_val, 2),
            "variance": round(var_val, 2),
            "q1": round(q25, 2),
            "q3": round(q75, 2),
            "iqr": round(iqr, 2)
        }

        # Outlier detection via IQR
        lower_bound = q25 - 1.5 * iqr
        upper_bound = q75 + 1.5 * iqr
        outlier_vals = series[(series < lower_bound) | (series > upper_bound)].tolist()
        outliers_data[col] = {
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "count": len(outlier_vals),
            "values": [round(float(v), 2) for v in outlier_vals]
        }

    # Correlation Matrix
    correlation_matrix = {}
    if len(numeric_cols) > 1:
        corr_df = inventory_df[numeric_cols].corr().fillna(0)
        correlation_matrix = corr_df.round(3).to_dict()

    return {
        "dataset_summary": {
            "total_records": total_records,
            "num_columns": len(inventory_df.columns),
            "duplicate_rows": duplicates,
            "memory_usage_kb": round(float(inventory_df.memory_usage(deep=True).sum() / 1024), 2)
        },
        "columns_info": columns_info,
        "missing_values": {k: int(v) for k, v in missing_values.items()},
        "descriptive_stats": descriptive_stats,
        "outliers": outliers_data,
        "correlation_matrix": correlation_matrix
    }


def compute_category_aggregates(inventory_df: pd.DataFrame) -> List[Dict[str, Any]]:
    """
    Computes shelf and category breakdown metrics using Pandas groupby.
    """
    if "category" not in inventory_df.columns or inventory_df.empty:
        return []

    grouped = inventory_df.groupby("category").agg(
        total_items=("currentStock", "sum"),
        total_capacity=("capacity", "sum"),
        avg_stock=("currentStock", "mean"),
        product_count=("id", "count")
    ).reset_index()

    grouped["utilization_pct"] = (grouped["total_items"] / grouped["total_capacity"] * 100).round(1)

    return grouped.to_dict(orient="records")
