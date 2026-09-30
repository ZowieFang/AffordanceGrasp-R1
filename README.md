# AffordanceGrasp-R1 Project Page

A polished academic project page organized as: hero radar chart, abstract,
framework, benchmark experiments, and real-robot videos.

## Preview
You can directly double-click `index.html`.

Three page directions are included:
- `index.html`: Version 1, the original project page
- `version-2/index.html`: Version 2, a light editorial research layout
- `version-3/index.html`: Version 3, a dark robotics-lab console layout

If Python is available:
```bash
python -m http.server 8000
```
then visit `http://localhost:8000`.

## Main files
- `index.html`: page content and section order
- `static/css/index.css`: font sizes, spacing, colors, layout
- `static/images/`: paper figures and robot rollout images
- `static/真机视频_web/`: 20 browser-optimized H.264 real-robot videos
- `static/真机视频/`: original videos (archive only; not used by the page)
- `static/pdf/AffordanceGraspR1_TRO2026.pdf`: latest local paper PDF
- `version-2/`: editorial variant with Easy/Hard video filtering
- `version-3/`: lab-console variant with per-task instruction switching

## Before publishing
The page uses high-resolution figures served by the paper's arXiv HTML page and
falls back to local PNG exports if the network is unavailable. The real-robot videos
autoplay at 2× speed, one visible row at a time, and loop while that row remains active. For
publishing, use the prepared `AffordanceGrasp-R1_Website.zip`; it excludes the large
source-video and working-material folders. Replace the Code placeholder when the
repository is public.
