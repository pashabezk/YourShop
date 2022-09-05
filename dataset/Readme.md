# О датасете

Для работы сайта был использован [Fashion Product Images Dataset](https://www.kaggle.com/datasets/paramaggarwal/fashion-product-images-dataset). Конкретно было загружено два файла: `styles.csv` и `images.csv`.

* `styles.csv` хранит данные о товарах
* `images.csv` хранит ссылки на фотографии товаров

Так как в данном датасете каждому товару соответствует одна фотография, то было решено объединить два файла в один, добавив в `styles.csv` ссылку на фотографию товара.

Перед запуском скрипта была обнаружена проблема: в колонке `productDisplayName` некоторые названия содержали запятые, из-за чего csv файл не читался нормально. Было принято решение удалить запятые из названий товаров.

Для объединения файлов был написан небольшой скрипт на питоне (смотри ниже).

### Добавление цены

Исходный датасет не содержал цену для товаров. Т.к. датасет используется исключительно ы целях обучения верстки сайта, то было решено использовать рандом для генерации цены. Чтобы цены были более менее реальными, был создан небольшой файл `prices.csv`, в котором я указал диапазоны цен для рандома на основе столбца `subCategory`.
Скрипт представлен ниже.

```py
import pandas as pd
import random as rand
import math

img = pd.read_csv("images.csv")
styles = pd.read_csv("styles.csv")
prices = pd.read_csv("prices.csv")

# ---------- Объединение датасетов
final = styles.copy()
final["idjpg"] = final.id.apply(lambda x: str(x)+".jpg") # добавляем столбец по которому будем соединять данные
final = st.join(img.set_index('filename'), on='idjpg') # присоединяем img
final.pop("idjpg") # удаляем уже ненужный столбец
final.rename(columns={'link':'imgUrl'}, inplace=True)  # переименовываем столбец

# ---------- Добавление цены
final2 = final.copy()
final2 = final2.join(prices.set_index('subCategory'), on='subCategory') # присоединяем prices

priceColumn = []  # колонка, которая будет добавлена в качестве цены
for row in final2.itertuples():
  if math.isnan(row.PriceFrom) or math.isnan(row.PriceTo):  # если по какой-то причине нет значения в диапазоне цен
    priceColumn.append(rand.randrange(500, 3000, 50)-1)
  else:
    priceColumn.append(rand.randrange(row.PriceFrom, row.PriceTo, 50)-1)  # добавление цены на основе рандома и диапазона
final2['price'] = pd.Series(priceColumn)  # добавление колонки с ценой
final2.pop('PriceFrom')  # удаление ненужных колонок
final2.pop('PriceTo')

# помещаем колонку с ценой перед url картинки
cols = final2.columns.tolist() 
newCols = cols[0:10]
newCols.append(cols[-1])
newCols.append(cols[-2])
final2 = final2[newCols]

# ---------- Сохранение датасета
final2.to_csv("Fashion Product Images Dataset.csv", index=False)
```

Команда для импорта csv-файла в mongo: `mongoimport --db yourshop --collection products --type=csv --headerline --file="Fashion Product Images Dataset.csv"`