# Word cloud chart
[![CircleCI](https://circleci.com/gh/qlik-oss/br.com.clever.wordcloud.svg?style=shield)](https://circleci.com/gh/qlik-oss/br.com.clever.wordcloud)

This extension intends to cover the need of including word clouds into Qlik Sense

# General Settings
- Orientation
- Start Angle
- End Angle
- Font Max Size
- Font Min Size
- Scale
- Scale Color
- Enable Custom Range. You can Specify a specific range of colors
- From
- To


![alt tag](/resources/word-cloud-screenshot.png)

![Specific Range of Colors](/resources/preview.png?raw=true "Specific Range of Colors")

# Installation

1. Download the extension zip, `qlik-word-cloud_<version>.zip`, from the latest release(https://github.com/qlik-oss/br.com.clever.wordcloud/releases/latest)
2. Install the extension:

   a. **Qlik Sense Desktop**: unzip to a directory under [My Documents]/Qlik/Sense/Extensions.

   b. **Qlik Sense Server**: import the zip file in the QMC.

# Developing the extension

If you want to do code changes to the extension follow these simple steps to get going.

1. Get Qlik Sense Desktop
1. Create a new app and add the extension to a sheet.
2. Clone the repository
3. Run `npm install`
4. Set the environment variable `BUILD_PATH` to your extensions directory. It will be something like `C:/Users/<user>/Documents/Qlik/Sense/Extensions/<extension_name>`.
5. You now have two options. Either run the watch task or the build task. They are explained below. Both of them default to development mode but can be run in production by setting `NODE_ENV=production` before running the npm task.

   a. **Watch**: `npm run watch`. This will start a watcher which will rebuild the extension and output all needed files to the `buildFolder` for each code change you make. See your changes directly in your Qlik Sense app.

   b. **Build**: `npm run build`. If you want to build the extension package. The output zip-file can be found in the `buildFolder`.

# Original author

[github.com/cleveranjos](https://github.com/cleveranjos)

# License

Copyright © 2015 Clever Anjos

Released under the Apache License 2.0.