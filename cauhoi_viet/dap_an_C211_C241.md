# Đáp án câu hỏi mới C211–C241 — cauhoi_viet

Nguồn là câu hỏi và ảnh người dùng gửi ngày 13/11/2026. **Không thay đổi `cauhoi_thong`**. `questions.json` là nguồn dữ liệu đầy đủ để dựng web quiz, trong khi tệp này giúp tra cứu nhanh các câu mới.

| Mã | Kiểu câu hỏi | Câu hỏi | Đáp án | Ảnh |
| --- | --- | --- | --- | --- |
| C211 | matching | Ghép mỗi mục bên trái với mô tả tương ứng bên phải. | Resolution → Biến thiên đầu vào nhỏ nhất phân biệt được; Hysteresis → Đầu ra phụ thuộc chiều quét đầu vào; Offset → Sai lệch điểm không; Cross-sensitivity → Ảnh hưởng của đại lượng phụ | [Ảnh gốc](screenshots/original-070325.png) |
| C212 | numeric | Dùng hình mạch bên phải với dữ kiện mới, không đọc R từ đồ thị. LDR R1 nối nguồn 5 V, R2 = 92 kΩ nối GND. Cho RLDR = 750 | 0.546318 V | [Hình](figures/ldr-voltage-divider.png) |
| C213 | matching | Ghép mỗi mục bên trái với mô tả tương ứng bên phải. Các ký hiệu đánh số theo hình trong đề mẫu. | Ký hiệu (1) → Tiệm cận điện dung; Ký hiệu (2) → Tiệm cận điện cảm đầu ra chuyển mạch; Ký hiệu (3) → Cảm biến quang khuếch tán theo đề mẫu; LVDT → Đo dịch chuyển tuyến tính bằng hỗ cảm vi sai | [Hình](figures/proximity-symbols.png) |
| C214 | matching | Ghép bước xử lý load cell với vai trò. | Zero/tare → Chỉnh điểm không; Span calibration → Xác định độ nhạy bằng tải chuẩn; Ratiometric conversion → Giảm ảnh hưởng biến thiên Vex; Filtering → Giới hạn băng thông và giảm nhiễu | [Ảnh gốc](screenshots/original-071701.png) |
| C215 | true_false | Cảm biến tuyến tính trong dải xét có độ nhạy tĩnh không đổi. | True |  |
| C216 | single_choice | Đầu ra có sai lệch cố định so với chuẩn ở mọi mức. Cần hiệu chỉnh gì trước? | Offset |  |
| C217 | numeric | Cảm biến có dải đo từ -40 đến 120 °C. Tính span theo °C. Chỉ nhập số theo đơn vị yêu cầu, dùng dấu chấm thập phân. | 160 °C |  |
| C218 | true_false | Responsivity của photodiode có đơn vị A/W. | True |  |
| C219 | true_false | Photodiode luôn chậm hơn LDR trong các ứng dụng dò sáng thông thường. | False |  |
| C220 | single_choice | Cần dò tín hiệu ánh sáng biến thiên nhanh. Phần tử nào thường phù hợp hơn LDR? | Photodiode |  |
| C221 | single_choice | Photodiode có responsivity 0.65 A/W, nhận công suất quang 55 µW. Bỏ qua dòng tối. Dòng quang bằng bao nhiêu? | 35.75 µA |  |
| C222 | numeric | Ánh sáng đơn sắc có λ = 440 nm. Dùng hc = 1240 eV·nm. Tính năng lượng một photon theo eV. Chỉ nhập số theo đơn vị yêu cầ | 2.818182 eV |  |
| C223 | numeric | Dòng quang sau trừ dòng tối là 5 µA, responsivity 0.25 A/W. Tính công suất quang tới theo µW. Chỉ nhập số theo đơn vị yê | 20 µW |  |
| C224 | fill_blank | Tên viết tắt của transimpedance amplifier là _____. Điền thuật ngữ, không thêm dấu chấm cuối câu. | TIA |  |
| C225 | true_false | Mắc RTD bốn dây giúp giảm ảnh hưởng điện trở dây lên phép đo. | True |  |
| C226 | single_choice | Để giảm ảnh hưởng điện trở dây đo RTD, chọn cấu hình nào? | Bốn dây |  |
| C227 | single_choice | Pt100 có R₀ = 100 Ω tại 0 °C, α = 0,00385 °C⁻¹. Theo mô hình tuyến tính, R tại 57 °C là bao nhiêu? | 121.945 Ω |  |
| C228 | single_choice | Cặp nhiệt điện có αab = 34 µV/K không đổi, đầu nóng 140 °C, đầu lạnh 17 °C. Điện áp xấp xỉ bằng bao nhiêu? | 4.182 mV |  |
| C229 | numeric | Thanh silic dài 29 mm, rộng 13 mm, dày 2.2 mm. n = p = 3.1×10¹² cm⁻³, µn = 1340, µp = 470 cm²/(V·s), q = 1,6×10⁻¹⁹ C. Tí | 11.294622 kΩ |  |
| C230 | numeric | RTD có R₀ = 325 Ω tại 20 °C và α = 0.0037 °C⁻¹. Đo R = 418.795000 Ω. Theo mô hình tuyến tính, tính T theo °C. Chỉ nhập s | 98 °C |  |
| C231 | numeric | NTC có R₀ = 10 kΩ tại 25 °C, β = 3550 K. Dùng R = R₀exp[β(1/T−1/T₀)], T theo K. Tính R tại 45 °C theo kΩ. Lấy T(K) = t(° | 4.730758 kΩ |  |
| C232 | true_false | Từ thông có đơn vị tesla. | False |  |
| C233 | true_false | Cảm biến từ trở biến đổi điện trở theo từ trường hoặc hướng từ. | True |  |
| C234 | single_choice | Với tụ phẳng, thông số nào ở mẫu số? | Khoảng cách d |  |
| C235 | single_choice | Tụ cảm biến có C = 21 pF. Khoảng cách bản tụ tăng 3 lần, A và ε giữ nguyên. Điện dung mới là bao nhiêu? | 7.000 pF |  |
| C236 | single_choice | LVDT có V1 = 1.71 V, V2 = 2.67 V cùng tham chiếu pha. Theo quy ước Vout = V2−V1, đầu ra bằng bao nhiêu? | 0.960 V |  |
| C237 | numeric | Tụ phẳng có A = 120 mm², d = 0.70 mm, εr = 2.6. Dùng ε₀ = 8,85×10⁻¹² F/m, bỏ qua hiệu ứng mép. Tính C theo pF. Chỉ nhập  | 3.944571 pF |  |
| C238 | fill_blank | Tên hiệu ứng tạo điện áp ngang do dòng điện và từ trường là _____. Điền thuật ngữ, không thêm dấu chấm cuối câu. | Hall |  |
| C239 | true_false | Ứng suất pháp có đơn vị N·m. | False |  |
| C240 | single_choice | Hiệu chuẩn span của cân cần gì? | Tải chuẩn |  |
| C241 | single_choice | Giữ v và θ không đổi, giảm λ một nửa làm \|fD\| thay đổi thế nào? | Tăng gấp đôi |  |

## Dữ liệu hình ảnh
- `C211`: ghép cặp Resolution, Hysteresis, Offset, Cross-sensitivity — lưu form gốc `screenshots/original-070325.png`.
- `C212`: mạch chia áp quang trở có R2=92 kΩ — lưu form gốc `screenshots/original-070703.png` và sử dụng hình cắt `figures/ldr-voltage-divider.png`.
- `C213`: ký hiệu (1), (2), (3), LVDT — lưu form gốc `screenshots/original-071349.png` và dùng `figures/proximity-symbols.png`.
- `C214`: ghép bước xử lý load cell — lưu form gốc `screenshots/original-071701.png`.
- Các ảnh gốc khác trong đợt này (`070529`, `070619`, `070956`, `071617`, `071640`, `071656`) được liên kết vào câu đã có. `option_variants` giữ thứ tự phương án thay đổi, không tạo câu trùng.

## Ghi chú
- Câu `C085` về LDR 6 V, R2=154 kΩ, RLDR=850 kΩ có đáp án tính toán **0.920 V** dù ảnh chụp đang tô một lựa chọn khác.
- Các câu nhập số lưu kết quả đầy đủ trong `answer` và chuỗi hiển thị gợi ý trong `display_answer` để chấm với dung sai phù hợp.
