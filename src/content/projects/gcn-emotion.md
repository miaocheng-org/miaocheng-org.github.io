---
title: "GCN-Emotion"
description: "PyTorch implementation of graph convolutional networks for emotion recognition from skeleton data."
tags: ["PyTorch", "GCN", "Emotion Recognition"]
github: "https://github.com/VictorS-67/gcn-emotion"
featured: true
date: 2024-03-20
---

## GCN-Emotion

A PyTorch implementation of our paper on emotion recognition using graph convolutional networks.

### Installation

```bash
pip install gcn-emotion
```

### Quick Start

```python
from gcn_emotion import EmotionGCN

model = EmotionGCN(num_classes=8)
prediction = model(skeleton_sequence)
```
