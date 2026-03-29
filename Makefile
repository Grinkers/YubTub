FILES = manifest.json content.js content.css rules.json icons/icon.svg
XPI = yubtub.xpi

all: $(XPI)

$(XPI): $(FILES)
	zip -r $@ $^

clean:
	rm -f $(XPI)

.PHONY: all clean
