#include <WiFi.h>
#include <HTTPClient.h>

// Enter Google_Deployment ID
const char *ssid = "Redmihouse";
const char *password = "1234567890p";
String GOOGLE_SCRIPT_ID = "AKfycby90t4BQiFrg5JyECb8KeVC16B_1YswKw78WvPY4XGCfI7oyAHu581EcZRr9C-3j1so";

// khai bao cam bien
//const int trig = 18;
//const int echo = 5;
long thoigian;
unsigned long Time;
float khoangcach;

const int sendInterval = 10000;

void setup() {
  Serial.begin(115200);
  Time = millis();
  //pinMode(trig, OUTPUT); // chân trig xuất tín hiệu
  //pinMode(echo, INPUT); // Chân echo nhận tín hiệu
  WiFi.mode(WIFI_STA);
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  Serial.println(ssid);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("CONNECTED !!!");
}

void loop() {
  boolean newData = false;
  if(millis() - Time >= 100)
  {
    Time = millis();
    if(Distance() != 0)
    {
      newData = true;
    }
  }

  //If newData is true
  if (newData == true)
  {
    newData = false;
    print_speed();
  }
  else
  {
    Serial.println("No new data is received.");
  }
  delay(sendInterval);
}

void print_speed()
{
  float kc = Distance();
  if (kc != 0)
  {
    Serial.println(kc);

    String param;
    param = "latitude=" + String(kc);

    Serial.println(param);
    write_to_google_sheet(param);
  }
  else
  {
    Serial.println("No data.");
  }
}

float Distance()
{
  // Tạo số ngẫu nhiên từ 0 đến 400 cm (giá trị ví dụ, bạn có thể thay đổi theo ý muốn)
  int randomDistance = random(0, 401);

  return randomDistance;
}

void write_to_google_sheet(String params) {
  HTTPClient http; // tạo đối tượng HTTPClient để quản lý các kết nối HTTP
  String url = "https://script.google.com/macros/s/" + GOOGLE_SCRIPT_ID + "/exec?" + params;
  Serial.println(url);
  Serial.println("Postring Distance data to Google sheet");


  // Bắt đầu gửi dữ liệu đến Google Sheets
  http.begin(url.c_str()); // Khởi tạo kết nối đến URL (chuyển đổi chuổi URL thành kiểu const char*)
  http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS); // Thiết lập để tự động theo dõi chuyển hướng HTTP

  int httpCode = http.GET(); // Gửi yêu cầu GET đến URL và nhận mã trạng thái HTTP
  Serial.print("HTTP Status Code: "); // In ra mã trạng thái HTTP
  Serial.println(httpCode);

  // Lấy phản hồi từ Google Sheets
  String payload;
  if (httpCode > 0) { // Kiểm tra nếu mã trạng thái HTTP là hợp lệ (lớn hơn 0)
    payload = http.getString(); // Nhận phản hồi dưới dạng chuỗi
    Serial.println("Payload: " + payload); // In ra nội dung phản hồi
  }
  http.end(); // Kết thúc kết nối HTTP
}
