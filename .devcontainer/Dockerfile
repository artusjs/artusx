FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

ARG ZSH_CONFIG="/root/.zshrc"

RUN \
  apt-get update \
  && apt-get install -y git-extras vim \
  && npm install -g @microsoft/rush@5.112.2 \
  && curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y \
  && echo "source /root/.cargo/env" >> $ZSH_CONFIG  

USER root
