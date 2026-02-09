import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';
import {components} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setScreen } from '../store/tabSlice';
import {useNavigation} from '@react-navigation/native';
import {svg} from '../assets/svg';
import axios from 'axios';
import { useMenu } from '../constants/MenuContext';
import { useTheme } from '../constants/ThemeContext';
import BottomTabBar from './tabs/BottomTabBar';
import EodForm from './EodForm';
import BocForm from './BocForm';
import IncidentForm from './IncidentForm';
import FastImage from 'react-native-fast-image';

function Webview({ route }) {
  const { url, type } = route.params;
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [isConnected, setIsConnected] = useState(true);
   const [menuData, setMenuData] = useState([]);
   const { refreshToggle } = useMenu();
  const [webViewKey, setWebViewKey] = useState(1);
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const [eodData, setEodData] = useState([]);
  const [bocData, setBocData] = useState([]);
  const [incidentData, setIncidentData] = useState([]);
    const [currentTable, setCurrentTable] = useState(type);
    const [eoduser, setEoduser] = useState('');
    const [eoduser2, setEoduser2] = useState('');
    const [bocuser, setBocuser] = useState('');
    const [bocuser2, setBocuser2] = useState('');
    const [incidentuser, setIncidentuser] = useState('');
    const [incidentuser2, setIncidentuser2] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages1, setTotalPages1] = useState('');
    const [currentPage1, setCurrentPage1] = useState(1);
    const [totalPages2, setTotalPages2] = useState('');
    const [currentPage2, setCurrentPage2] = useState(1);
  
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
         fetchEodData(page);
      }
    }; 

    const changePage1 = (page) => {
      if (page >= 1 && page <= totalPages1) {
        setCurrentPage1(page);
         fetchBocData(page);
      }
    }; 

    const changePage2 = (page) => {
      if (page >= 1 && page <= totalPages2) {
        setCurrentPage2(page);
         fetchIncidentData(page);
      }
    }; 

    const renderPagination = () => {
      const styles = StyleSheet.create({
        paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10, },
        paginationButton: { padding: 8,  backgroundColor: '#E0E0E0', borderRadius: 5 },
        pageNumber: { padding: 8, marginHorizontal: 3, backgroundColor: '#E0E0E0', borderRadius: 5 },
        activePage: { backgroundColor: '#21AFF0' },
        paginationText: { color: 'black', fontWeight: 'bold' },
        activePageText: { color: 'white', fontWeight: 'bold' },
      });
      let pages = [];
      if (totalPages <= 7) {
        pages = [...Array(totalPages)].map((_, i) => i + 1);
      } else {
        pages = [1, 2, 3, '...', totalPages - 1, totalPages];
        if (currentPage > 3 && currentPage < totalPages - 2) {
          pages = [1, 2, '...', currentPage, '...', totalPages - 1, totalPages];
        }
      }
  
      return (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={() => changePage(currentPage - 1)} disabled={currentPage === 1} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'<'}</Text>
          </TouchableOpacity>
          {pages.map((page, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => typeof page === 'number' && changePage(page)}
              style={[styles.pageNumber, currentPage === page && styles.activePage]}
              disabled={page === '...'}
            >
              <Text style={currentPage === page ? styles.activePageText : styles.paginationText}>{page}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const renderPagination1 = () => {
      const styles = StyleSheet.create({
        paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10,},
        paginationButton: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
        pageNumber: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
        activePage: { backgroundColor: '#21AFF0' },
        paginationText: { color: 'black', fontWeight: 'bold' },
        activePageText: { color: 'white', fontWeight: 'bold' },
      });
      let pages = [];
      if (totalPages1 <= 7) {
        pages = [...Array(totalPages1)].map((_, i) => i + 1);
      } else {
        pages = [1, 2, 3, '...', totalPages1 - 1, totalPages1];
        if (currentPage1 > 3 && currentPage1 < totalPages1 - 2) {
          pages = [1, 2, '...', currentPage1, '...', totalPages1 - 1, totalPages1];
        }
      }
  
      return (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={() => changePage1(currentPage1 - 1)} disabled={currentPage1 === 1} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'<'}</Text>
          </TouchableOpacity>
          {pages.map((page, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => typeof page === 'number' && changePage1(page)}
              style={[styles.pageNumber, currentPage1 === page && styles.activePage]}
              disabled={page === '...'}
            >
              <Text style={currentPage1 === page ? styles.activePageText : styles.paginationText}>{page}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => changePage1(currentPage + 1)} disabled={currentPage1 === totalPages1} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      );
    };

    const renderPagination2 = () => {
      const styles = StyleSheet.create({
        paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10,},
        paginationButton: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
        pageNumber: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
        activePage: { backgroundColor: '#21AFF0' },
        paginationText: { color: 'black', fontWeight: 'bold' },
        activePageText: { color: 'white', fontWeight: 'bold' },
      });
      let pages = [];
      if (totalPages2 <= 7) {
        pages = [...Array(totalPages2)].map((_, i) => i + 1);
      } else {
        pages = [1, 2, 3, '...', totalPages2 - 1, totalPages2];
        if (currentPage2 > 3 && currentPage2 < totalPages2 - 2) {
          pages = [1, 2, '...', currentPage2, '...', totalPages2 - 1, totalPages2];
        }
      }
  
      return (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={() => changePage2(currentPage2 - 1)} disabled={currentPage2 === 1} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'<'}</Text>
          </TouchableOpacity>
          {pages.map((page, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => typeof page === 'number' && changePage2(page)}
              style={[styles.pageNumber, currentPage2 === page && styles.activePage]}
              disabled={page === '...'}
            >
              <Text style={currentPage2 === page ? styles.activePageText : styles.paginationText}>{page}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => changePage2(currentPage2 + 1)} disabled={currentPage2 === totalPages2} style={styles.paginationButton}>
            <Text style={styles.paginationText}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      );
    };




  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);
        if (!state.isConnected) {
          setWebViewKey(prevKey => prevKey + 1); // Force WebView reload
        }
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [isConnected]);

  const renderHeader = () => {
    return <components.Header
     logo={false}
     goBack={true}
     creditCard={true} />;
  };
  

  const getButtons = () => {
    if (type === 'eod') {
      return ['Add EOD', 'View EOD'];
    } else if (type === 'boc') {
      return ['Add BOC', 'View BOC'];
    } else if (type === 'incident') {
      return ['Add Incident', 'View Incident'];
    }
    return [];
  };


      const fetchEodData = async (page = 1) => {
        try {
          setLoading(true); // Start loading
          const ref_db = await AsyncStorage.getItem('ref_db');
          const employeeid = await AsyncStorage.getItem('secondaryId');
    
          if (!ref_db || !employeeid) {
            console.error('ref_db or employeeid is missing');
            setLoading(false); // Stop loading
            return;
          }
    
          const response = await axios.get(`https://app.nexis365.com/api/eod-pagination`, {
            params: { ref_db, employeeid, page, limit: 50 },
          });
           console.log("EOD RESPONSE", response);
          if (response.data.success) {
            setEodData(response.data.data);
            setEoduser(response.data.eoduser || '');
            setEoduser2(response.data.eoduser2 || '');
            setTotalPages(response.data.totalPages);
            console.log("Total EOD pages:", response.data.totalPages)
          } else {
            setEodData([]);
          }
        } catch (error) {
          console.error('Error fetching EOD data:', error);
        } finally {
          setLoading(false); // Stop loading after success or failure
        }
      };

      useEffect(() => {
         fetchIncidentData(currentPage2); // Fetch data for the initial page
          console.log(`Fetching data for incident page: ${currentPage2}`);
         }, [currentPage2]);

         useEffect(() => {
          fetchEodData(currentPage); // Fetch data for the initial page
           console.log(`Fetching data for eod page: ${currentPage}`);
          }, [currentPage]);


          useEffect(() => {
            fetchBocData(currentPage1); // Fetch data for the initial page
             console.log(`Fetching data for boc page: ${currentPage1}`);
            }, [currentPage1]);

      const fetchBocData = async (page = 1) => {
        try {
          setLoading(true); // Start loading
          const ref_db = await AsyncStorage.getItem('ref_db');
          const employeeid = await AsyncStorage.getItem('secondaryId');
    
          if (!ref_db || !employeeid) {
            setLoading(false); // Stop loading
            console.error('ref_db or employeeid is missing');
            return;
          }
    
          const response = await axios.get(`https://app.nexis365.com/api/boc-pagination`, {
            params: { ref_db, employeeid, page, limit: 50 },
          });
          console.log("BOC RESPONSE", response);
          if (response.data.success) {
            setBocData(response.data.data);
            setBocuser(response.data.bocuser || '');
            setBocuser2(response.data.bocuser2 || '');
            setTotalPages1(response.data.totalPages);
            console.log("Total BOC pages:", response.data.totalPages)
          } else {
            setBocData([]);
          }
        } catch (error) {
          console.error('Error fetching BOC data:', error);
        }finally {
          setLoading(false); // Stop loading after success or failure
        }
      };
    
      const fetchIncidentData = async (page = 1) => {
        try {
          setLoading(true);
          const ref_db = await AsyncStorage.getItem('ref_db');
          const employeeid = await AsyncStorage.getItem('secondaryId');
    
          if (!ref_db || !employeeid) {
            setLoading(false);
            console.error('ref_db or employeeid is missing');
            return;
          }
    
          const response = await axios.get(`https://app.nexis365.com/api/incident-pagination`, {
            params: { ref_db, employeeid, page, limit: 50 },
          });
          console.log("Incident RESPONSE", response);
          if (response.data.success) {
            setIncidentData(response.data.data);
            setIncidentuser(response.data.incidentuser || '');
            setIncidentuser2(response.data.incidentuser2 || ''); 
            setTotalPages2(response.data.totalPages);
            console.log("Total INCIDENT pages:", response.data.totalPages)
          } else {
            setIncidentData([]);
          }
        } catch (error) {
          console.error('Error fetching Incident data:', error);
        } finally {
          setLoading(false);
        }
      };


      const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#333' : '#fff' }]}>
      {renderHeader()}

      <View style={styles.buttonContainer}>
        {getButtons().map((button, index) => (
          <TouchableOpacity key={index} style={styles.button}
          onPress={() => {
            if (button.includes('View EOD')) {
              setCurrentTable('eod');
              setShowBlankScreen(true);
              fetchEodData();
            }else if (button.includes('View BOC')) {
              setCurrentTable('boc');
              setShowBlankScreen(true);
              fetchBocData();
            } else if (button.includes('View Incident')) {
              setCurrentTable('incident');
              setShowBlankScreen(true);
              fetchIncidentData();
            } else if (button.includes('Add EOD')) {
              setCurrentTable('eod'); 
              setShowBlankScreen(false); 
            }else if (button.includes('Add BOC')) {
              setCurrentTable('boc'); 
              setShowBlankScreen(false); 
            }else if (button.includes('Add INCIDENT')) {
              setCurrentTable('incident'); 
              setShowBlankScreen(false); 
            } else {
              setShowBlankScreen(false);
            }
          }}
          >
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.webViewContainer, {backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>
      {showBlankScreen ? (
          <ScrollView style={[styles.blankScreen, {backgroundColor: theme === 'dark' ? '#333' : '#fff'}]}>

          {currentTable === 'eod' && (
            loading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <FastImage
                source={require('../assets/moving.gif')}
                style={{ width: 100, height: 100 }}
                resizeMode={FastImage.resizeMode.contain}
              />
              </View>
            ) : eodData.length > 0 ? (
              <>
                <Text style={[styles.tableTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>EOD DATA</Text>
                <ScrollView horizontal>
                  <View style={{ width: 340, marginBottom:150 }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.headerText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0 }]}>Date</Text>
                      <Text style={styles.headerText}>Participant</Text>
                      <Text style={[styles.headerText,{textAlign:'right',  width: 60, minWidth: 60, maxWidth: 60, flex: 0, paddingRight:10 }]}>Shift</Text>
                    </View>
                    <FlatList
                      data={eodData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                          <Text style={[styles.rowText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0, color: theme === 'dark' ? '#fff' : '#000' }]}>{formatDate(item.eod_date)}</Text>
                          <Text style={[styles.rowText,{textAlign:'left', paddingRight:10, fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000'}]}>{item.eoduser} {item.eoduser2}</Text>
                          <Text style={[styles.rowText,{textAlign:'right', width: 60, minWidth: 60, maxWidth: 60, flex: 0, paddingRight:10, color: theme === 'dark' ? '#fff' : '#000' }]}>{item.shiftid}</Text>
                        </View>
                      )}
                    />
                    <View style={{alignItems:'center',padding:10}} >{renderPagination()}</View>
                  </View>  
                </ScrollView>
              </>
            ) : (
              <Text style={[styles.noDataText, {color: theme === 'dark' ? '#fff' : '#000'}]}>No EOD data available</Text> // Show this when no data is available
            )
          )}

          {currentTable === 'boc' && (
            loading ? (
              // <Text style={[styles.loadingText, {color: theme === 'dark' ? '#fff' : '#000'}]}>Data Loading Please wait....</Text> 
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <FastImage
                source={require('../assets/moving.gif')}
                style={{ width: 100, height: 100 }}
                resizeMode={FastImage.resizeMode.contain}
              />
              </View>
            ) : bocData.length > 0 ? (
              <>
                <Text style={[styles.tableTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>BOC DATA</Text>
                <ScrollView horizontal>
                  <View style={{ width: 340, marginBottom:150 }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.headerText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0 }]}>Date</Text>
                      <Text style={styles.headerText}>Participant</Text>
                      <Text style={[styles.headerText,{textAlign:'right',  width: 120, minWidth: 120, maxWidth: 120, flex: 0, paddingRight:10 }]}>Duration</Text>
                    </View>
                    <FlatList
                      data={bocData}
                      keyExtractor={(item, index) => index.toString()}  
                      renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                          <Text style={[styles.rowText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0, color: theme === 'dark' ? '#fff' : '#000' }]}>{formatDate(item.date)}</Text>
                          <Text style={[styles.rowText,{textAlign:'left', paddingRight:10, color: theme === 'dark' ? '#fff' : '#000'}]}>
                          <Text style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>{item.bocuser} {item.bocuser2}</Text>
                           {'\n'}
                           {item.typeid}
                          </Text>
                          <Text  style={[styles.rowText,{textAlign:'right', width: 120, minWidth: 120, maxWidth: 120, flex: 0, paddingRight:10, color: theme === 'dark' ? '#fff' : '#000' }]}>{`${item.frequencyid}\n${item.durationid}`}</Text>
                        </View>
                      )}
                    />
                    {renderPagination1()}
                  </View>
                </ScrollView>
              </>
            ) : (
              <Text style={[styles.noDataText, {color: theme === 'dark' ? '#fff' : '#000'}]}>No BOC data available</Text> // Show when no data is available
            )
          )}

          {currentTable === 'incident' && (
            loading ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
              <FastImage
                source={require('../assets/moving.gif')}
                style={{ width: 100, height: 100 }}
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            ) : incidentData.length > 0 ? (
              <>
                <Text style={[styles.tableTitle, {color: theme === 'dark' ? '#fff' : '#000'}]}>INCIDENT DATA</Text>
                <ScrollView horizontal>
                  <View style={{ width: 340, marginBottom:150 }}>
                    <View style={styles.tableHeader}>
                      <Text style={[styles.headerText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0 }]}>Date</Text>
                      <Text style={styles.headerText}>Participant</Text>
                      <Text style={[styles.headerText,{textAlign:'right',  width: 90, minWidth: 90, maxWidth: 90, flex: 0, paddingRight:10 }]}>Location</Text>
                    </View>
                    <FlatList
                      data={incidentData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <View style={styles.tableRow}>
                          <Text style={[styles.rowText,{textAlign:'left',  width: 80, minWidth: 80, maxWidth: 80, flex: 0, color: theme === 'dark' ? '#fff' : '#000' }]}>
                            {`${formatDate(item.date)}\n${formatDate(item.incidentdate)}`}
                          </Text>
                          <Text style={[styles.rowText,{textAlign:'left', paddingRight:10, color: theme === 'dark' ? '#fff' : '#000'}]}>
                          <Text style={{ fontWeight: 'bold', color: theme === 'dark' ? '#fff' : '#000' }}>{item.incidentuser}{item.incidentuser2}</Text>
                            {'\n'}
                            {item.location}
                            </Text>
                          <Text style={[styles.rowText,{textAlign:'right', width: 90, minWidth: 90, maxWidth: 90, flex: 0, paddingRight:10, color: theme === 'dark' ? '#fff' : '#000' }]}>
                            {item.involved}
                          </Text>
                        </View>
                      )}
                    />
                    {renderPagination2()}
                  </View> 
                </ScrollView>
              </>
            ) : (
              <Text style={[styles.noDataText, {color: theme === 'dark' ? '#fff' : '#000'}]}>No INCIDENT data available</Text> // Show when no data is available
            )
          )}

        </ScrollView>   
        ) :  (
          <View style={styles.webViewContainer}>
          {currentTable === 'eod' ? (
            <EodForm theme={theme} /> 
          ) : currentTable === 'boc' ? (
            <BocForm theme={theme} /> 
          ) : currentTable === 'incident' ? (
            <IncidentForm theme={theme} /> 
          ) : (
            <Text style={styles.singleText}>No Form Selected</Text>
          )}
        </View>
        )}
      </View>
      <BottomTabBar/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  button: {
    backgroundColor: '#21AFF0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  webViewContainer: {
    flex: 1,
    marginTop:2,
    borderRadius: 0,
    overflow: 'hidden',
  },
  blankScreen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },

  tableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#21AFF0',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },

  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',  
    paddingLeft: 10,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },

  rowText: {
    fontSize: 12,
    flex: 1,
    // textAlign: 'center',
    color:'#333',
    textAlign: 'left',
    paddingLeft: 10, 
  },

  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },

  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },

  paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  paginationButton: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
  pageNumber: { padding: 10, marginHorizontal: 5, backgroundColor: '#E0E0E0', borderRadius: 5 },
  activePage: { backgroundColor: '#007BFF' },
  paginationText: { color: 'black', fontWeight: 'bold' },
  activePageText: { color: 'white', fontWeight: 'bold' },
});

export default Webview;
