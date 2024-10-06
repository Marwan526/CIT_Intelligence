const persons = JSON.parse(localStorage.getItem('persons')) || [];

function createPersonFile() {
    const fileName = document.getElementById('fileName').value;
    const coverImage = document.getElementById('coverImage').files[0];
    const password = document.getElementById('filePassword').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const socialLinks = document.getElementById('socialLinks').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    const email = document.getElementById('email').value;
    const extraImages = document.getElementById('extraImages').files;

    if (fileName && coverImage && password && age && gender && email && phoneNumber && socialLinks) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const person = {
                fileName: fileName,
                coverImage: e.target.result,
                password: password,
                age: age,
                gender: gender,
                phoneNumber: phoneNumber,
                socialLinks: socialLinks,
                email: email,
                additionalInfo: additionalInfo,
                extraImages: [],
            };

            // قراءة الصور الإضافية (حتى 7 صور)
            if (extraImages.length > 0 && extraImages.length <= 7) {
                for (let i = 0; i < extraImages.length; i++) {
                    const extraImageReader = new FileReader();
                    extraImageReader.onload = function (e) {
                        person.extraImages.push(e.target.result);
                        if (person.extraImages.length === extraImages.length) {
                            persons.push(person);
                            localStorage.setItem('persons', JSON.stringify(persons));
                            displayPersons();
                            clearFields();
                        }
                    };
                    extraImageReader.readAsDataURL(extraImages[i]);
                }
            } else {
                persons.push(person);
                localStorage.setItem('persons', JSON.stringify(persons));
                displayPersons();
                clearFields();
            }
        };
        reader.readAsDataURL(coverImage);
    } else {
        alert("يرجى ملء جميع الحقول.");
    }
}

function displayPersons() {
    const personList = document.getElementById('person-list');
    personList.innerHTML = '';
    persons.forEach((person, index) => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        personCard.innerHTML = `
            <img src="${person.coverImage}" width="120" style="border-radius: 50%;"><br>
            <strong>${person.fileName}</strong><br>
            <div class="actions">
                <button class="button action-button" onclick="showPersonDetails(${index})">عرض</button>
                <button class="button action-button" onclick="editPerson(${index})">تعديل</button>
                <button class="button action-button" onclick="deletePerson(${index})">حذف</button>
            </div>
        `;
        personList.appendChild(personCard);
    });
}

function showPersonDetails(index) {
    const person = persons[index];
    const password = prompt('ادخل كلمة المرور:');
    if (password === person.password) {
        const extraImagesHtml = person.extraImages.map(img => `<img src="${img}" width="50" style="margin: 5px;">`).join('');
        const detailsHtml = `
            <div style="text-align:center;">
                <h2>${person.fileName}</h2>
                <img src="${person.coverImage}" width="300" style="border-radius: 8px;"><br>
                <p><strong>العمر:</strong> ${person.age}</p>
                <p><strong>الجنس:</strong> ${person.gender}</p>
                <p><strong>رقم الهاتف:</strong> <a href="tel:${person.phoneNumber}">${person.phoneNumber}</a></p>
                <p><strong>البريد الإلكتروني:</strong> <a href="mailto:${person.email}">${person.email}</a></p>
                <p><strong>رابط الصفحة:</strong> <a href="${person.socialLinks}" target="_blank">اضغط هنا</a></p>
                <p><strong>معلومات إضافية:</strong> ${person.additionalInfo}</p>
                <div>${extraImagesHtml}</div>
                <button class="button" onclick="goBack()">رجوع</button>
                <button class="button" onclick="shareInfo('${person.fileName}', '${person.email}', '${person.phoneNumber}', '${person.socialLinks}')">مشاركة المعلومات</button>
            </div>
        `;
        document.body.innerHTML = detailsHtml;
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

function goBack() {
    window.location.reload(); // تحديث الصفحة للعودة إلى القائمة
}

function shareInfo(fileName, email, phoneNumber, socialLinks) {
    const message = `اسم: ${fileName}\nبريد إلكتروني: ${email}\nرقم هاتف: ${phoneNumber}\nروابط: ${socialLinks}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    const options = `
        <div>
            <a href="${telegramUrl}" target="_blank">مشاركة عبر Telegram</a><br>
            <a href="${whatsappUrl}" target="_blank">مشاركة عبر WhatsApp</a>
        </div>
    `;
    document.body.innerHTML += options; // عرض روابط المشاركة
}

function editPerson(index) {
    const person = persons[index];
    const password = prompt('ادخل كلمة المرور لتعديل الملف:');
    if (password === person.password) {
        document.getElementById('fileName').value = person.fileName;
        document.getElementById('coverImage').value = ''; // إعادة تعيين الملف
        document.getElementById('filePassword').value = person.password;
        document.getElementById('age').value = person.age;
        document.getElementById('gender').value = person.gender;
        document.getElementById('phoneNumber').value = person.phoneNumber;
        document.getElementById('socialLinks').value = person.socialLinks;
        document.getElementById('email').value = person.email;
        document.getElementById('additionalInfo').value = person.additionalInfo;
        deletePerson(index); // حذف الشخص الحالي حتى يتم تعديله
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

function deletePerson(index) {
    const password = prompt('ادخل كلمة المرور لحذف الملف:');
    if (password === persons[index].password) {
        persons.splice(index, 1);
        localStorage.setItem('persons', JSON.stringify(persons)); // حفظ البيانات بعد الحذف
        displayPersons();
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
}

// عرض الأشخاص عند تحميل الصفحة
window.onload = displayPersons;

function clearFields() {
    document.getElementById('fileName').value = '';
    document.getElementById('coverImage').value = '';
    document.getElementById('filePassword').value = '';
    document.getElementById('age').value = '';
    document.getElementById('gender').value = 'ذكر'; // إعادة تعيين الجنس
    document.getElementById('phoneNumber').value = '';
    document.getElementById('socialLinks').value = '';
    document.getElementById('email').value = '';
    document.getElementById('extraImages').value = '';
    document.getElementById('additionalInfo').value = '';
}