# 1. Use official Python image
FROM python:3.11-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy requirements
COPY . /app

# 4. Install dependencies
RUN pip install -r requirements.txt

# 5. Copy all backend code
COPY . .

# 6. Expose Flask port
EXPOSE 5000

# 7. Run Flask app
CMD ["python", "./app.py"]
