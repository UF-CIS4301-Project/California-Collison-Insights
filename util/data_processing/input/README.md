# `data_processing/input`

### Overview
- This directory houses the `california_traffic_collisions.sqlite` data that is added to the [.gitignore](../.gitignore).

- Unfortunately, the file itself is over 9 GB and is too big to be uploaded to GitHub.

- Please visit this [link](https://www.kaggle.com/datasets/alexgude/california-traffic-collision-data-from-switrs/data) to find the original data source on Kaggle!

### Installation
To run the data cleanup, please follow these instructions:
1. Download the [source data](https://www.kaggle.com/datasets/alexgude/california-traffic-collision-data-from-switrs/data)
2. Extract the zip folder and rename the file as `california_traffic_collisions.sqlite`
3. Run `data_processing.py` in order to clean up the data
4. Result will be in the sibling directory `output`