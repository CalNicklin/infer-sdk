FROM runpod/pytorch:2.2.1-py3.10-cuda12.1.1-devel-ubuntu22.04

# Install Python Dependencies
COPY builder/requirements.txt /requirements.txt
RUN python -m pip install --upgrade pip && \
    python -m pip install --upgrade -r /requirements.txt --no-cache-dir && \
    rm /requirements.txt

# Cache Models
COPY builder/cache_model.py /cache_model.py
RUN python /cache_model.py && \
    rm /cache_model.py

# Copy Source Code
WORKDIR /app
COPY src/ .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV TORCH_CUDA_ARCH_LIST="7.5 8.0 8.6"
ENV CUDA_LAUNCH_BLOCKING=0

# Pre-warm the model during container build
RUN python -c "import handler; print('Model pre-warmed')"

CMD ["python", "-u", "handler.py"]