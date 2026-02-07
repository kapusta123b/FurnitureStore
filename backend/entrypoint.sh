#!/bin/sh

echo "DB NAME: $POSTGRES_DB"
mkdir -p /app/static /app/media /app/staticfiles /app/media/goods_images

chown -R nonroot:nonroot /app/static /app/media /app/staticfiles
chmod -R 755 /app/static /app/media /app/staticfiles

echo "Waiting for postgres..."
while ! nc -z "db" ${POSTGRES_PORT:-5432}; do
  sleep 0.5
done
echo "PostgreSQL started"

python manage.py migrate
python manage.py compilescss
python manage.py collectstatic --noinput
python manage.py loaddata fixtures/goods/goods_Category.json
python manage.py loaddata fixtures/goods/goods_Products.json
python manage.py loaddata fixtures/goods/goods_ProductImage.json

exec "$@"