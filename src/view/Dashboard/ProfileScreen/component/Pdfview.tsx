import { View, Text } from 'react-native'
import React from 'react'
import Pdf from 'react-native-pdf';
import { openUrl } from '../../../../functions/helperFunction';
import tw from 'twrnc';

interface PdfviewProps {
    filename: string
}
const Pdfview: React.FC<PdfviewProps> = ({filename}) => {
    return (
        <Pdf
            trustAllCerts={false}
            source={{uri: filename, cache: true}}
            onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
            }}
            onError={(error) => {
                console.log(error);
            }}
            onPressLink={(uri) => {
                openUrl(uri)
            }}
            spacing={0}
            fitPolicy={0}
            maxScale={2}
            style={tw`flex-1`}
        />
    )
}

export default Pdfview