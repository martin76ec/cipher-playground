import { Button, Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useState } from 'react';
import { cipher, decipher } from '../../actions/cipher';

const validPermutations = {
  '8': [0, 1, 2, 3, 4, 5, 6, 7],
  '10': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  '12': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  '14': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  '16': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  '18': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  '20': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  '22': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  '24': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
};

const StrImp = () => {
  const [content, setContent] = useState('');
  const [blocksize, setBlocksize] = useState(8);
  const [permutation, setPermutation] = useState('');
  const [sustitution, setSustitution] = useState('');
  const [rounds, setRounds] = useState(1);

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
    let unresult;

    try {
      result = cipher(content, config);
      unresult = decipher(result, config);
      console.log(content)
      console.log(result)
      console.log(unresult)
      alert('RESULT:' + JSON.stringify(result.map(block => block[block.length - 1])));
      alert('ORIGINAL:' + JSON.stringify(unresult.map(block => block[block.length - 1])));
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
        <Button icon='file-document-outline' mode="contained" onPress={handleOpenFile} style={styles.button}>Decipher</Button>
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