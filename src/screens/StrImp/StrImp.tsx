import { Button, Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import * as Sharing from 'expo-sharing';
import { cipher, decipher } from '../../actions/cipher';
import { Document, Packer, Paragraph } from 'docx';
import { printToFileAsync } from 'expo-print';

const writePdf = async (content: string, name: string) => {
  const html = `${content}`;

  const { uri } = await printToFileAsync(({
    html: html,
    base64: true
  }));

  await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
};

const writeDocx = async (content: string, name: string) => {
  const filename = FileSystem.documentDirectory + name + '.docx';

  try {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: content })
          ]        
        }
      ]
    });
    const result = await Packer.toBase64String(doc).then((base64) => {
      FileSystem.writeAsStringAsync(filename, base64, {
        encoding:FileSystem.EncodingType.UTF8
      });
    });
    Sharing.shareAsync(filename);
    return result;
  } catch(error) {
    console.error(error);
    alert(error); 
  }
};

const StrImp = () => {
  const [content, setContent] = useState('');
  const [blocksize, setBlocksize] = useState('');
  const [permutation, setPermutation] = useState('');
  const [sustitution, setSustitution] = useState('');
  const [rounds, setRounds] = useState(1);
  const [mimetype, setMimetype] = useState('');

  const handleOpenFile = async () => {
    const file: any = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ],
    });
    const response = await FileSystem.uploadAsync('https://document-parser.fly.dev/upload-file', file.uri, {
      fieldName: 'file',
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    });

    console.log((JSON.parse(response.body).content));
    setMimetype(file.mimeType);
    setContent(JSON.parse(response.body).content);
  };

  const onCipher = () => {
    const config = {
      blocksize: Number(blocksize),
      positions: permutation.split(',').map(c => Number(c.trim())),
      mod: Number(sustitution),
      rounds: Number(rounds),
    };
    let result;

    try {
      if (blocksize === '') throw Error('blocksize cannot be empty');
      if (permutation === '') throw Error('permutation cannot be empty');
      if (sustitution === '') throw Error('sustitution cannot be empty');
      if (rounds === '') throw Error('rounds cannot be empty');
      if (!content) throw Error('file cannot be empty');

      if (isNaN(Number(blocksize))) throw Error('blocksize should be a number');
      if (isNaN(Number(sustitution))) throw Error('sustitution should be a number');
      if (isNaN(Number(rounds))) throw Error('rounds should be a number');

      if (Number(blocksize) > 24 || Number(blocksize) < 8) throw Error('blocksize should be a number between 8 and 24');
      if (Number(blocksize) % 2 !== 0) throw Error('blocksize should be an odd number');
      if (Number(sustitution) > 10 || Number(sustitution) < -10) throw Error('sustitution should be a number between 10 and -10');
      if (Number(rounds) < 1 || Number(blocksize) > 30) throw Error('rounds should be a number between 1 and 30');

      result = cipher(content, config);

      const filetext: string = result.map(block => block[block.length - 1]).join('');
      const original = decipher(filetext, config);
      alert('DECIPHER:' + original.map(block => block[block.length - 1]).join(''));
      alert('CIPHER:' + filetext);
      console.log(original.map(block => block[block.length - 1]).join(''));

      if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        writeDocx(filetext, 'cipher').then((res) => console.log('wrote', res));
      } else if (mimetype === 'application/pdf') {
        writePdf(filetext, 'cipher').then((res) => console.log('wrote', res));
      } else {
        alert('not accepted filetype provided');
      }

    } catch(error) {
      alert(error);
    }
  };

  const onDecipher = () => {
    const config = {
      blocksize: Number(blocksize),
      positions: permutation.split(',').map(c => Number(c.trim())),
      mod: Number(sustitution),
      rounds: Number(rounds),
    };

    let result;

    try {
      if (blocksize === '') throw Error('blocksize cannot be empty');
      if (permutation === '') throw Error('permutation cannot be empty');
      if (sustitution === '') throw Error('sustitution cannot be empty');
      if (rounds === '') throw Error('rounds cannot be empty');
      if (!content) throw Error('file cannot be empty');

      if (isNaN(Number(blocksize))) throw Error('blocksize should be a number');
      if (isNaN(Number(sustitution))) throw Error('sustitution should be a number');
      if (isNaN(Number(rounds))) throw Error('rounds should be a number');

      if (Number(blocksize) > 24 || Number(blocksize) < 8) throw Error('blocksize should be a number between 8 and 24');
      if (Number(blocksize) % 2 !== 0) throw Error('blocksize should be an odd number');
      if (Number(sustitution) > 10 || Number(sustitution) < -10) throw Error('sustitution should be a number between 10 and -10');
      if (Number(rounds) < 1 || Number(blocksize) > 30) throw Error('rounds should be a number between 1 and 30');

      result = decipher(content, config);
      const filetext: string = result.map(block => block[block.length - 1]).join('');
      if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        writeDocx(filetext, 'cipher').then((res) => console.log('wrote', res));
      } else if (mimetype === 'application/pdf') {
        writePdf(filetext, 'cipher').then((res) => console.log('wrote', res));
      } else {
        alert('not accepted filetype provided');
      }
    } catch(error) {
      alert(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button icon='file-document-outline' mode="contained" onPress={handleOpenFile} style={styles.button}>Open File</Button>
      <View style={styles.inputContainer}>
        <View style={styles.hContainer}>
          <Text>Block size</Text>
          <TextInput
            label=""
            value={blocksize}
            onChangeText={text => setBlocksize(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.hContainer}>
          <Text>Permutation</Text>
          <TextInput
            label=""
            value={permutation}
            onChangeText={text => setPermutation(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.hContainer}>
          <Text>Sustitution</Text>
          <TextInput
            label=""
            value={sustitution}
            onChangeText={text => setSustitution(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.hContainer}>
          <Text>Rounds</Text>
          <TextInput
            label=""
            value={rounds}
            onChangeText={text => setRounds(text)}
            style={styles.input}
          />
        </View>
      </View>
      <View style={styles.hContainer}>
        <Button icon='file-document-outline' mode="contained" onPress={onCipher} style={styles.button}>Cipher</Button>
        <Button icon='file-document-outline' mode="contained" onPress={onDecipher} style={styles.button}>Decipher</Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 800,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  input: {
    height: 20,
    width: 200,
    paddingTop: 10,
    marginTop: 20
  },
  button: {
    marginTop: 20,
  },
  hContainer: {
    width: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: 200,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  }
});

export { StrImp };