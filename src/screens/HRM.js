import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
  Text,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Checkbox, Button, IconButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {share} from 'react-native-share';
import {useNavigation} from '@react-navigation/native';

const HRM = () => {
  const [data, setData] = useState([]);
  const [ip, setIp] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [credit, setCredit] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigation = useNavigation();

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleOptionSelect = async (option) => {
    toggleDropdown();
    switch (option) {
      case 'Download CSV':
        await downloadCSV();
        break;
      case 'Download PDF':
        await downloadPDF();
        break;
      case 'Download Excel':
        await downloadExcel();
        break;
      default:
        break;
    }
  };

  const downloadCSV = async () => {
    const csvContent = [
      ['ID', 'IP', 'Date', 'Note', 'Credit'],
      ...data.map((item) => [
        item.id,
        item.ip,
        item.date,
        item.note,
        item.credit,
      ]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const path = `${RNFS.DocumentDirectoryPath}/tableData.csv`;
    await RNFS.writeFile(path, csvContent, 'utf8');
    shareFile(path, 'application/csv');
  };

  const downloadPDF = async () => {
    const html = `
      <h1>Table Data</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>IP</th>
          <th>Date</th>
          <th>Note</th>
          <th>Credit</th>
        </tr>
        ${data
          .map(
            (item) => `
          <tr>
            <td>${item.id}</td>
            <td>${item.ip}</td>
            <td>${item.date}</td>
            <td>${item.note}</td>
            <td>${item.credit}</td>
          </tr>`,
          )
          .join('')}
      </table>
    `;

    const options = {
      html,
      fileName: 'tableData',
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    shareFile(file.filePath, 'application/pdf');
  };

  const downloadExcel = async () => {
    const sheetContent = [
      ['ID', 'IP', 'Date', 'Note', 'Credit'],
      ...data.map((item) => [
        item.id,
        item.ip,
        item.date,
        item.note,
        item.credit,
      ]),
    ];

    const path = `${RNFS.DocumentDirectoryPath}/tableData.xlsx`;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetContent);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, path);
    shareFile(
      path,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
  };

  const shareFile = async (path, type) => {
    try {
      await share({
        url: `file://${path}`,
        type,
        message: 'Here is your file!',
      });
    } catch (error) {
      console.error('Failed to share file:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update the 'select dual row selections
    if (
      selectedRows.length === paginatedList.length &&
      paginatedList.length > 0
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRows, paginatedList]);

  const loadData = async () => {
    try {
      await AsyncStorage.clear();
      const storedData = await AsyncStorage.getItem('tableData');
      if (storedData) {
        setData(JSON.parse(storedData));
      } else {
        const dummyData = Array.from({length: 50}, (_, index) => ({
          id: index + 1,
          ip: `192.168.1.${index + 1}`,
          date: `2024-10-${(index + 1).toString().padStart(2, '0')}`,
          note: `Note ${index + 1}`,
          credit: (Math.random() * 100).toFixed(2),
        }));
        setData(dummyData);
        await AsyncStorage.setItem('tableData', JSON.stringify(dummyData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem('tableData', JSON.stringify(newData));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const handleSearchIconPress = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleAdd = () => {
    const newData = editRow
      ? data.map((item) =>
          item.id === editRow.id ? {...editRow, ip, date, note, credit} : item,
        )
      : [...data, {id: Date.now(), ip, date, note, credit}];

    setData(newData);
    saveData(newData);
    setSideOpen(false);
    setIp('');
    setDate('');
    setNote('');
    setCredit('');
    setEditRow(null);
  };

  const handleEdit = (item) => {
    setEditRow(item);
    setIp(item.ip);
    setDate(item.date);
    setNote(item.note);
    setCredit(item.credit);
    setSideOpen(true);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleDeleteAll = () => {
    const updatedData = data.filter((item) => !selectedRows.includes(item.id));
    setData(updatedData);
    saveData(updatedData);
    setSelectedRows([]);
    setSelectAll(false); // Reset selectAll when items are deleted
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      const currentIds = paginatedList.map((item) => item.id);
      setSelectedRows(currentIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((row) => row !== id)
        : [...prevSelectedRows, id],
    );
  };

  const filterData = () => {
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item) => {
      const values = `${item.ip} ${item.date} ${item.note} ${item.credit}`;
      return values.toLowerCase().includes(query);
    });
  };

  const filteredList = filterData();

  const totalPages = Math.ceil(filteredList.length / rowsPerPage);
  const paginatedList = filteredList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    let pages = [];
    if (totalPages <= 3) {
      pages = Array.from({length: totalPages}, (_, i) => i + 1);
    } else {
      pages = [1, 2, 3, '...', totalPages];
      if (currentPage > 3 && currentPage < totalPages - 1) {
        pages = [1, '...', currentPage, '...', totalPages];
      } else if (currentPage === totalPages - 1) {
        pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
      }
    }

    return (
      <View
        style={{flexDirection: 'row', justifyContent: 'center', padding: 10}}
      >
        <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
          <MaterialCommunityIcons name='chevron-left' size={32} />
        </TouchableOpacity>
        {pages.map((page, index) =>
          page === '...' ? (
            <Text key={index} style={{marginHorizontal: 5, fontSize: 22}}>
              ...
            </Text>
          ) : (
            <TouchableOpacity
              key={index}
              onPress={() => handlePageChange(page)}
              style={{marginHorizontal: 5}}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: currentPage === page ? 'bold' : 'normal',
                }}
              >
                {page}
              </Text>
            </TouchableOpacity>
          ),
        )}
        <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
          <MaterialCommunityIcons name='chevron-right' size={32} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal visible={sideOpen} animationType='slide'>
        <View style={{flex: 1, padding: 20, backgroundColor: 'white'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#333333'}}>
              Add/Edit Item
            </Text>
            <IconButton
              icon='close'
              onPress={() => setSideOpen(false)}
              style={{marginLeft: 10}}
            />
          </View>
          <TextInput
            placeholder='Enter IP'
            value={ip}
            onChangeText={setIp}
            style={{
              marginVertical: 8,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#333333',
              padding: 10,
            }}
          />
          <TextInput
            placeholder='Enter Date'
            value={date}
            onChangeText={setDate}
            style={{
              marginVertical: 8,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#333333',
              padding: 10,
            }}
          />
          <TextInput
            placeholder='Enter Note'
            value={note}
            onChangeText={setNote}
            style={{
              marginVertical: 8,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#333333',
              padding: 10,
            }}
          />
          <TextInput
            placeholder='Enter Credit'
            value={credit}
            onChangeText={setCredit}
            style={{
              marginVertical: 8,
              borderBottomWidth: 1,
              borderWidth: 1,
              borderRadius: 8,
              borderColor: '#333333',
              padding: 10,
            }}
          />
          <Button mode='contained' onPress={handleAdd} style={{marginTop: 20}}>
            {editRow ? 'Save Changes' : 'Add'}
          </Button>
        </View>
      </Modal>

      <ScrollView horizontal>
        <View
          style={{
            marginTop: 20,
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginBottom: 15,
            width: 600,
            borderColor: '#e59866',
          }}
        >
          <View style={{flexDirection: 'row', paddingBottom: 5}}>
            <Text style={{flex: 1, fontWeight: 'bold'}}>Select</Text>
            <Text style={{flex: 1, fontWeight: 'bold', marginRight: 20}}>
              IP
            </Text>
            <Text style={{flex: 1, fontWeight: 'bold', marginRight: 20}}>
              Date
            </Text>
            <Text style={{flex: 1, fontWeight: 'bold', marginRight: 20}}>
              Note
            </Text>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginRight: 30,
              }}
            >
              Credit
            </Text>
            <Text
              style={{
                flex: 1,
                fontWeight: 'bold',
                marginRight: 20,
                marginLeft: 20,
              }}
            >
              Actions
            </Text>
          </View>
          <FlatList
            data={paginatedList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 5,
                  borderBottomWidth: 1,
                  marginTop: 5,
                  borderColor: '#fad7a0',
                }}
              >
                <Checkbox
                  status={
                    selectedRows.includes(item.id) ? 'checked' : 'unchecked'
                  }
                  onPress={() => handleSelectRow(item.id)}
                  color='#FF6347'
                  uncheckedColor='#f5b7b1'
                />
                <Text style={{flex: 1, marginLeft: 15}}>{item.ip}</Text>
                <Text style={{flex: 1}}>{item.date}</Text>
                <Text style={{flex: 1}}>{item.note}</Text>
                <Text style={{flex: 1}}>{item.credit}</Text>

                {/* Actions View */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity onPress={() => handleEdit(item)}>
                    <MaterialCommunityIcons name='pencil' size={26} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <MaterialCommunityIcons name='delete' size={26} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
      {renderPagination()}

      {/* Search Bar */}
      {searchBarVisible && (
        <View style={styles.searchBarWrapper}>
          <TextInput
            placeholder='Search...'
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      )}

      {/* Dropdown options, absolutely positioned */}
      {dropdownVisible && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('Download CSV')}
          >
            <View style={styles.iconTextContainer}>
              <MaterialCommunityIcons
                name='file-download-outline'
                size={24}
                color='#f1948a'
              />
              <Text style={styles.optionText}>CSV</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('Download PDF')}
          >
            <View style={styles.iconTextContainer}>
              <MaterialCommunityIcons
                name='file-pdf-box'
                size={24}
                color='#f1948a'
              />
              <Text style={styles.optionText}>PDF</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleOptionSelect('Download Excel')}
          >
            <View style={styles.iconTextContainer}>
              <MaterialCommunityIcons
                name='file-excel-box'
                size={24}
                color='#f1948a'
              />
              <Text style={styles.optionText}>Excel</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* Rectangular bar with square buttons */}
      <View style={styles.iconBar}>
        <IconButton
          icon='plus'
          onPress={() => setSideOpen(true)}
          size={30}
          color='white'
          style={styles.iconButton}
        />
        <TouchableOpacity
          onPress={handleSelectAll}
          style={[
            styles.iconButton,
            {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={selectAll ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={30}
            color='gray'
          />
        </TouchableOpacity>

        <IconButton
          icon='delete'
          size={30}
          // color='white'
          disabled={selectedRows.length === 0}
          onPress={handleDeleteAll}
          color={selectedRows.length === 0 ? 'gray' : 'red'}
          style={styles.iconButton}
        />
        <IconButton
          icon='magnify'
          size={30}
          color='white'
          onPress={handleSearchIconPress}
          style={styles.iconButton}
        />
        <IconButton
          icon='download'
          size={30}
          color='white'
          onPress={toggleDropdown}
          style={styles.iconButton}
        />
        <IconButton
          icon='printer'
          size={30}
          color='white'
          onPress={() => console.log('Print button pressed')}
          style={styles.iconButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  iconBar: {
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  searchBarWrapper: {
    position: 'absolute',
    // top: 0,
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  searchInput: {
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '96%',
    marginTop: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    // top: 75,
    // left: 20,
    bottom: 80,
    right: 60,
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    padding: 5,
    zIndex: 10,
  },
  option: {
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#f1948a',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HRM;
