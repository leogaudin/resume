all: generate pdf copy

generate:
	node generate.js

pdf:
	pdflatex -output-directory=dist dist/resume.tex

copy:
	cp dist/resume.html ../gaudin/index.html
	cp dist/resume.pdf ./resume.pdf

clean:
	rm -f dist/*.aux dist/*.log dist/*.out dist/*.toc

.PHONY: all generate pdf copy clean